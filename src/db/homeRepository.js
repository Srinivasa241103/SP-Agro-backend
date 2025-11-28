import { pool } from "./pool.js";

export default class HomeRepository {
    constructor() {
        this.pool = pool;
    }
    async getDashboardImages() {
        const query = `
            SELECT 
                image_name  AS imageName,
                image_url   AS imageUrl
            FROM dashboard_images;`;
        const { rows } = await this.pool.query(query);
        return rows;
    }

    async getFastSellingProductsForDashboard() {
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
                (inv.available_quantity > 0)                    AS isStockAvailable,
                inv.available_quantity                          AS availableQuantity,
                (inv.available_quantity < 10)                   AS lowStockAlert
            FROM products pr
            JOIN product_categories pc ON pr.category_id = pc.id
            JOIN product_images pi ON pr.id = pi.product_id
            JOIN inventory inv ON pr.id = inv.product_id
            WHERE pr.is_active = true
            AND inv.available_quantity < 10;   
            `;
        const { rows } = await this.pool.query(query);
        return rows;
    }
}