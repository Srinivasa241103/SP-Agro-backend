import CartRepository from "../db/cartRepository.js";

export default class CartService {
    constructor() {
        this.cartRepo = new CartRepository();
    }

    async getCartDetailsByOwner(cartOwner) {
        const returnObject = {
            cartId: null,
            subTotal: 0,
            cartItems: [],
            ownerType: cartOwner.type
        }

        let userCart;

        // Find or Create Cart based on owner type
        if (cartOwner.type === 'user') {
            // Query: WHERE user_id = cartOwner.userId
            userCart = await this.cartRepo.getActiveCartByUserId(cartOwner.userId);

            // Create: INSERT (user_id) if not found
            if (!userCart) {
                userCart = await this.cartRepo.createCartForUser(cartOwner.userId);
            }
        } else if (cartOwner.type === 'guest') {
            // Query: WHERE session_id = cartOwner.sessionId
            userCart = await this.cartRepo.getActiveCartBySessionId(cartOwner.sessionId);

            // Create: INSERT (session_id, expires_at) if not found
            if (!userCart) {
                userCart = await this.cartRepo.createCartForGuest(cartOwner.sessionId);
            }
        }

        if (!userCart?.cartId) {
            return returnObject;
        }

        const cartItems = await this.cartRepo.getCartItemsByCartId(userCart.cartId);

        if (!cartItems || cartItems.length === 0) {
            returnObject.cartId = userCart.cartId;
            return returnObject;
        }

        // Calculate subtotal
        for (const item of cartItems) {
            const price = (item.itemSalePrice && item.itemSalePrice > 0)
                ? item.itemSalePrice
                : item.itemPrice;
            returnObject.subTotal += price * item.itemQuantity;
        }

        // Ensure subtotal is not negative
        if (returnObject.subTotal < 0) {
            returnObject.subTotal = 0;
        }

        returnObject.cartItems = cartItems;
        returnObject.cartId = userCart.cartId;
        return returnObject;
    }
}