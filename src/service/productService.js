import ProductRepository from '../db/productRepository.js';
class ProductService {
    constructor() {
        this.productRepo = new ProductRepository();
    }

    async getProducts() {
        const products = await this.productRepo.getProducts();
        if (!products.length > 0) {
            return null;
        }
        return products;
    }
}

export default ProductService;