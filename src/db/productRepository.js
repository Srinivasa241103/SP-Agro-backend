import { pool } from './pool.js';

class ProductRepository {
    async getProducts() {
        const query = `
            SELECT 
                pr.id                                           AS productId,
                pr.name                                         AS productName,
                pr.base_price                                   AS productBasePrice,
                pr.sale_price                                   AS productSalePrice,
                pr.description                                  AS productDescription,
                pc.name                                         AS productCategory,
                pi.image_url                                    AS productImageUrl,
                pi.alt_text                                     AS productImageAltText,
                CASE WHEN 
                        inv.available_quantity > 0 
                    THEN 
                        true ELSE false END                     AS isStockAvailable,
                CASE WHEN 
                        inv.available_quantity < 10 
                    THEN 
                        inv.available_quantity 
                    ELSE 
                        NULL 
                END                                             AS lowStockAlert
            FROM products pr
            JOIN product_categories pc ON pr.category_id = pc.id
            JOIN product_images pi ON pr.id = pi.product_id
            JOIN inventory inv ON pr.id = inv.product_id
            WHERE pr.is_active = true;`;

        const { rows } = await pool.query(query);
        return rows;
    }
}

export default ProductRepository;