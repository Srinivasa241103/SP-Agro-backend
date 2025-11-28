import CartRepository from "../db/cartRepository.js";
import ProductRepository from "../db/productRepository.js";

export default class CartService {
    constructor() {
        this.cartRepo = new CartRepository();
        this.productRepo = new ProductRepository();
    }

    async getCartDetailsByOwner(cartOwner) {
        const returnObject = {
            cartId: null,
            subTotal: 0,
            cartItems: [],
            ownerType: cartOwner.type
        }

        let userCart;
        if (cartOwner.type === 'user') {
            userCart = await this.cartRepo.getActiveCartByUserId(cartOwner.userId);
        } else if (cartOwner.type === 'guest') {
            userCart = await this.cartRepo.getActiveCartBySessionId(cartOwner.sessionId);
        }

        if (!userCart?.cartId) {
            return returnObject;
        }

        const cartItems = await this.cartRepo.getCartItemsByCartId(userCart.cartId);

        if (!cartItems || cartItems.length === 0) {
            returnObject.cartId = userCart.cartId;
            return returnObject;
        }

        for (const item of cartItems) {
            const price = (item.itemSalePrice && item.itemSalePrice > 0)
                ? item.itemSalePrice
                : item.itemPrice;
            returnObject.subTotal += price * item.itemQuantity;
        }

        if (returnObject.subTotal < 0) {
            returnObject.subTotal = 0;
        }

        returnObject.cartItems = cartItems;
        returnObject.cartId = userCart.cartId;
        return returnObject;
    }

    async addToCart(productDetails) {
        const returnObject = {
            message: " ",
            success: false,
            cartId: null
        }

        const cartOwnerDetails = productDetails.cartOwnerDetails;
        const productId = productDetails.productId;
        const quantity = productDetails.quantity;

        let cartId;
        if (cartOwnerDetails.type === 'user') {
            const userCart = await this.cartRepo.getActiveCartByUserId(cartOwnerDetails.userId);
            if (!userCart?.cartId) {
                const newCartId = await this.cartRepo.createCartForUser(cartOwnerDetails.userId);
                cartId = newCartId;
            } else {
                cartId = userCart.cartId;
            }
        } else if (cartOwnerDetails.type === 'guest') {
            const userCart = await this.cartRepo.getActiveCartBySessionId(cartOwnerDetails.sessionId);
            if (!userCart?.cartId) {
                const newCartId = await this.cartRepo.createCartForGuest(cartOwnerDetails.sessionId);
                cartId = newCartId;
            } else {
                cartId = userCart.cartId;
            }
        }

        const addToCartOptions = {
            productId,
            quantity,
            cartId
        }

        const availableQuantity = await this.productRepo.getProductInventory(productId);
        if (availableQuantity < quantity) {
            returnObject.message = "Not enough stock available";
            return returnObject;
        }



    }
}