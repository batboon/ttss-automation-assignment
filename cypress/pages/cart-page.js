import { CommonPage } from "./common-page";

const commonPage = new CommonPage();

export class CartPage {
    checkProductsInCart(unwantedProducts) {
        cy.then(() => {
            const productsInCart = Cypress.env('productsInCart');
            const keywordsArray = commonPage.ensureArray(productsInCart);

            commonPage.logInfo('Checking items in the cart..');
            this.removeProductsFromCart(unwantedProducts);
            return cy.get('[data-test="inventory-item-name"]').then(($els) => {
                const actualProductsInCartArray = $els.toArray().map(el => el.textContent.trim());
                cy.wrap(actualProductsInCartArray.sort()).should('deep.equal', keywordsArray.sort());
            });
        })
    }

    clickButtonOnCartItem(button, itemName) {
        cy.wrap(itemName)
            .parentsUntil('.inventory_item')
            .children('.item_pricebar').children('button')
            .contains(button)
            .click();
    }

    clickRemoveButton(itemName) {
        this.clickButtonOnCartItem(config.buttons.remove, itemName);
    }

    removeProductsFromCart(productKeywords) {
        const keywordsArray = commonPage.ensureArray(productKeywords);
        let productsRemoved = [];
        return cy.get('[data-test="inventory-item-name"]').each((itemName) => {
            const productName = itemName.text().trim();
            keywordsArray.some((keyword) => {
                if (productName.includes(keyword)) {
                    commonPage.logInfo(`Removing ${productName} from the cart..`);
                    this.clickRemoveButton(itemName);
                    productsRemoved = commonPage.appendToList(productName, productsRemoved);
                    return true;
                } else if (!productName.includes(keyword)) {
                    commonPage.logWarning(`${productName} is not a ${keyword}.`);
                }
            });
        }).then(() => {
            commonPage.updateProductsRemovedFromCart(productsRemoved);
            commonPage.logInfo(`${productsRemoved} product(s) removed from the cart.`);
        });
    }

    checkoutCart() {
        commonPage.logInfo('Proceeding to checkout..');
        cy.get('[data-test="checkout"]').click();
    }
}