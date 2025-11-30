import CartService from "../service/cartService.js";

const cartService = new CartService();
export const getCarts = async (req, res) => {
    try {
        const cartOwnerDetails = req.cartOwner;;
        const responseBody = {
            success: false,
            message: "",
            cartData: {}
        }
        const cartData = await cartService.getCartDetailsByOwner(cartOwnerDetails);
        if (!cartData?.cartId) {
            responseBody.message = "No Cart Found";
            return res.status(200).json(responseBody);
        }
        responseBody.success = true;
        responseBody.message = "Cart Data Fetched";
        responseBody.cartData = cartData;

        return res.status(200).json(responseBody);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const addToCart = async (req, res) => {
    const cartOwnerDetails = req.cartOwner;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid product details"
        })
    }

    const productDetails = {
        cartOwnerDetails,
        productId,
        quantity
    }

    try {
        const responseBody = {
            success: false,
            message: ""
        }
        const cartResponse = await cartService.addToCart(productDetails);
        if (!cartResponse.success) {
            responseBody.success = false;
            responseBody.message = cartResponse.message;
            return res.status(200).json(responseBody);
        }
        responseBody.success = true;
        responseBody.message = cartResponse.message;
        responseBody.cartId = cartResponse.cartId;
        return res.status(200).json(responseBody);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
