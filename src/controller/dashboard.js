import { DashboardService } from "../service/dashboardService.js";

const dashboardService = new DashboardService();
export const dashboard = async (req, res) => {
    try {
        const responseBody = {
            success: false,
            message: "",
            data: {}
        }

        const dashboardData = await dashboardService.getDashboardData();
        responseBody.success = true;
        responseBody.message = "Dashboard Data Fetched";
        responseBody.data = dashboardData;

        return res.status(200).json(responseBody);
    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}