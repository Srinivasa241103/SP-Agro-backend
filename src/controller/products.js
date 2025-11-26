import { ProductService } from '../service/productService.js';

const productService = new ProductService();

export const getProductsForDashboard = async (req, res) => {
    const { page, limit, searchQuery } = req.query;
    try {
        const productList = await productService.getProducts();

        if (!productList) {
            return res.status(404).json({
                success: false,
                message: "No products available"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Products details fetched successfully",
            products: productList
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
