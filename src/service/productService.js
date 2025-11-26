export default class ProductService {
    constructor() {
        this.productRepo = require('../db/productRepository.js');
    }

    async getProducts() {
        const products = await this.productRepo.getProducts();
        return products;
    }
}