import HomeRepository from "../db/homeRepository.js";
import ProductRepository from "../db/productRepository.js";

export class DashboardService {
    constructor() {
        this.productRepo = new ProductRepository();
        this.homeRepo = new HomeRepository();
    }

    async getDashboardData() {
        const returnObject = {};

        const dashboardImages = await this.homeRepo.getDashboardImages();
        if (dashboardImages.length > 0) {
            returnObject.dashboardImages = dashboardImages;
        }

        const fastSellingProducts = await this.homeRepo.getFastSellingProductsForDashboard();
        if (fastSellingProducts.length > 0) {
            returnObject.fastSellingProducts = fastSellingProducts;
        }

        return returnObject;
    }
}