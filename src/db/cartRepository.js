import { pool } from "../config/db.js";

export default class CartRepository {
    async getActiveCartByUserId(userId) {
        const query = `SELECT c.id            AS cartId
                        FROM carts c
                        WHERE c.user_id = ?
                        AND c.deleted_at IS NULL
                        ORDER BY c.id DESC
                        LIMIT 1
                        `;
        const [rows] = await pool.query(query, [userId]);
        return rows[0];
    }

    async getActiveCartBySessionId(sessionId) {
        const query = `SELECT c.id            AS cartId
                        FROM carts c
                        WHERE c.session_id = ?
                        AND c.deleted_at IS NULL
                        AND (c.expires_at IS NULL OR c.expires_at > NOW())
                        ORDER BY c.id DESC
                        LIMIT 1
                        `;
        const [rows] = await pool.query(query, [sessionId]);
        return rows[0];
    }

    async createCartForUser(userId) {
        const query = `INSERT INTO carts (user_id, created_at, updated_at)
                        VALUES (?, NOW(), NOW())
                        `;
        const [result] = await pool.query(query, [userId]);
        return { cartId: result.insertId };
    }

    async createCartForGuest(sessionId) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

        const query = `INSERT INTO carts (session_id, expires_at, created_at, updated_at)
                        VALUES (?, ?, NOW(), NOW())
                        `;
        const [result] = await pool.query(query, [sessionId, expiresAt]);
        return { cartId: result.insertId };
    }

    async getCartItemsByCartId(cartId) {
        const query = `SELECT ci.cart_item_id            AS cartItemId,
                        pr.id                            AS productId,
                        pr.name                          AS itemName,
                        pr.base_price                    AS itemPrice,
                        pr.sale_price                    AS itemSalePrice,
                        pi.image_url                     AS itemImageUrl,
                        ci.quantity                      AS itemQuantity,
                        CASE WHEN inv.quantity >= ci.quantity THEN TRUE
                            ELSE FALSE
                        END                              AS inStock
                        FROM cart_items ci
                        JOIN products pr ON ci.product_id = pr.id
                        LEFT JOIN product_images pi ON pr.id = pi.product_id AND pi.is_primary = 1
                        JOIN inventories inv ON pr.id = inv.product_id
                        WHERE ci.cart_id = ?
                        AND ci.deleted_at IS NULL;
                        `;
        const [rows] = await pool.query(query, [cartId]);
        return rows;
    }
}