import { CommonPage } from "../../pages/common-page";
import { CartPage } from "../../pages/cart-page";
import { CheckoutPage } from "../../pages/checkout-page";

describe("Assignment 1: Automate UI", () => {
    const commonPage = new CommonPage();
    const cartPage = new CartPage();
    const checkoutPage = new CheckoutPage();

    const config = Cypress.env("web");

    it("Automate UI 1: User can buy T-Shirt successfully", () => {
        commonPage.logInfo('Test started: User can buy T-Shirt successfully');

        // 1. Navigate to homepage and login
        commonPage.goToUrl(config.homepageUrl);

        commonPage.loginToSite(
            config.loginCredentials.username,
            config.loginCredentials.password
        );

        // 2. Look for T-Shirt(s), Flashlight(s), Backpack(s), and add to cart
        commonPage.addProductsToCart(config.productKeyword);
        commonPage.removeProductsFromCart(config.productKeyword[2]);
        commonPage.goToCartScreen();

        // 3. Remove Backpack(s) from cart, check item(s) in cart, remove any unwanted item(s) from cart
        cartPage.checkProductsInCart(config.productKeyword[2]);
        cartPage.checkoutCart();

        // 4. Enter checkout information and continue to checkout
        checkoutPage.enterCheckoutInfo(
            config.personalInfo.firstName,
            config.personalInfo.lastName,
            config.personalInfo.postalCode
        );

        checkoutPage.continueCheckout();

        // 5. Check item(s) to checkout and price calculations
        checkoutPage.checkProductsToCheckout();

        checkoutPage.checkSubtotal();
        checkoutPage.checkTax();
        checkoutPage.checkTotal();

        // 6. Finish order checkout and verify order completion screen
        checkoutPage.finishCheckout();

        // End of test
        commonPage.logSuccess('Test completed: User can buy T-Shirt successfully');
    })
})