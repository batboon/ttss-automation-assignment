import { CommonPage } from "./common-page";

const commonPage = new CommonPage();

export class CartPage {
    checkProductsInCart(unwantedProducts) {
        if (Cypress.env('productsInCart')) {
            const productsInCart = Cypress.env('productsInCart');
            const keywordsArray = commonPage.ensureArray(productsInCart);

            cy.task('logAction', { message: '[Info] Checking items in the cart..', specFile: Cypress.spec.relative });
            this.removeProductsFromCart(unwantedProducts);
            return cy.get('[data-test="inventory-item-name"]').then(($els) => {
                const actualProductsInCartArray = $els.toArray().map(el => el.textContent.trim());
                cy.wrap(actualProductsInCartArray.sort()).should('deep.equal', keywordsArray.sort());
            });
        }
    }

    clickRemoveButton(itemName) {
        cy.wrap(itemName)
            .parentsUntil('.inventory_item')
            .children('.item_pricebar').children('button')
            .contains('Remove')
            .click();
    }

    removeProductsFromCart(productKeywords) {
        const keywordsArray = commonPage.ensureArray(productKeywords);
        let productsRemoved = [];
        return cy.get('[data-test="inventory-item-name"]').each((itemName) => {
            const productName = itemName.text().trim();
            keywordsArray.some((keyword) => {
                if (productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Info] Removing ${productName} from the cart..`, specFile: Cypress.spec.relative });
                    this.clickRemoveButton(itemName);
                    productsRemoved = commonPage.appendToList(productName, productsRemoved);
                    return true;
                } else if (!productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Warning] ${productName} is not a ${keyword}.`, specFile: Cypress.spec.relative });
                }
            });
        }).then(() => {
            commonPage.updateProductsRemovedFromCart(productsRemoved);
            cy.task('logAction', { message: `[Info] ${productsRemoved} product(s) removed from the cart.`, specFile: Cypress.spec.relative });
        });
    }

    checkoutCart() {
        cy.task('logAction', { message: '[Info] Proceeding to checkout..', specFile: Cypress.spec.relative });
        cy.get('[data-test="checkout"]').click();
    }
}