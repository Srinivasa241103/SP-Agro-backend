import { pool } from "./pool.js";

export default class CartRepository {
    async getActiveCartByUserId(userId) {
        const query = `SELECT c.id            AS "cartId"
                        FROM carts c
                        WHERE c.user_id = $1
                        AND c.deleted_on IS NULL
                        ORDER BY c.id DESC
                        LIMIT 1
                        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    }

    async getActiveCartBySessionId(sessionId) {
        const query = `SELECT c.id            AS "cartId"
                        FROM carts c
                        WHERE c.session_id = $1
                        AND c.deleted_on IS NULL
                        AND (c.expires_at IS NULL OR c.expires_at > NOW())
                        ORDER BY c.id DESC
                        LIMIT 1
                        `;
        const result = await pool.query(query, [sessionId]);
        return result.rows[0];
    }

    async createCartForUser(userId) {
        const query = `INSERT INTO carts (user_id, created_at, updated_at)
                        VALUES ($1, NOW(), NOW())
                        RETURNING id AS "cartId"
                        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    }

    async createCartForGuest(sessionId) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

        const query = `INSERT INTO carts (session_id, expires_at, created_at, updated_at)
                        VALUES ($1, $2, NOW(), NOW())
                        RETURNING id AS "cartId"
                        `;
        const result = await pool.query(query, [sessionId, expiresAt]);
        return result.rows[0];
    }

    async getCartItemsByCartId(cartId) {
        const query = `SELECT 
                            ci.cart_item_id AS "cartItemId",
                            pr.id AS "productId",
                            pr.name AS "itemName",
                            pr.base_price AS "itemPrice",
                            pr.sale_price AS "itemSalePrice",
                            pi.image_url AS "itemImageUrl",
                            ci.quantity AS "itemQuantity",
                            CASE WHEN inv.available_quantity >= ci.quantity::int 
                                THEN TRUE 
                                ELSE FALSE 
                            END             AS "inStock"
                        FROM cart_items ci
                        JOIN products pr ON ci.product_id = pr.id
                        LEFT JOIN product_images pi ON pr.id = pi.product_id AND pi.is_primary = TRUE
                        JOIN inventory inv ON pr.id = inv.product_id
                        WHERE ci.cart_id = $1
                        AND ci.is_deleted IS NULL;
                        `;
        const result = await pool.query(query, [cartId]);
        return result.rows;
    }

    async addCartItem({
        productId,
        quantity,
        cartId
    }) {
        const query = `
                INSERT INTO cart_items (product_id, quantity, cart_id)
                VALUES ($1, $2, $3)
                RETURNING cart_item_id AS "cartItemId"
                `;
        const result = await pool.query(query, [productId, quantity, cartId]);
        return Boolean(result.rows[0]);
    }

    async updateCartItem({
        itemQuantity,
        cartItemId
    }) {
        const query = `
                UPDATE cart_items
                SET quantity = $1
                WHERE cart_item_id = $2
                RETURNING cart_item_id AS "cartItemId"
                `;
        const result = await pool.query(query, [itemQuantity, cartItemId]);
        return Boolean(result.rows[0]);
    }

    async updateCartPrice(cartId) {
        const query = `
                UPDATE carts
                SET total_amount = (SELECT SUM(ci.quantity * pr.sale_price) 
                                    FROM cart_items ci 
                                    JOIN products pr ON ci.product_id = pr.id 
                                    WHERE ci.cart_id = $1) 
                WHERE id = $1
                RETURNING total_amount AS "cartTotalPrice"
                `;
        const result = await pool.query(query, [cartId]);
        return result.rows[0];
    }
}