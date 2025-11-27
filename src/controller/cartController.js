import CartService from "../service/cartService.js";

const cartService = new CartService();

export const getCarts = async (req, res) => {
    try {
        const cartOwner = req.cartOwner;

        if (!cartOwner) {
            return res.status(401).json({
                success: false,
                message: "Cart owner information missing"
            });
        }

        const responseBody = {
            success: false,
            message: "",
            cartData: {}
        }

        const cartData = await cartService.getCartDetailsByOwner(cartOwner);

        if (!cartData?.cartId) {
            responseBody.message = "Cart is empty";
            responseBody.cartData = {
                cartId: null,
                subTotal: 0,
                cartItems: [],
                ownerType: cartOwner.type
            };
            return res.status(200).json(responseBody);
        }

        responseBody.success = true;
        responseBody.message = cartOwner.type === 'guest'
            ? "Guest cart data fetched successfully"
            : "Cart data fetched successfully";
        responseBody.cartData = cartData;

        return res.status(200).json(responseBody);

    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}