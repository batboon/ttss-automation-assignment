import { CommonPage } from "./common-page";

const commonPage = new CommonPage();

export class CartPage {
    checkProductsInCart(expectedCart, unwantedProducts) {
        const keywordsArray = commonPage.ensureArray(expectedCart);

        cy.task('logAction', { message: '[Info] Checking items in the cart..', specFile: Cypress.spec.relative });
        return cy.get('[data-test="inventory-item-name"]').then(($els) => {
            const actualProductsInCartArray = $els.toArray().map(el => el.textContent.trim());

            cy.wrap(actualProductsInCartArray.sort()).should('deep.equal', keywordsArray.sort()).then((result) => {
                if (!result) {
                    this.removeProductsFromCart(unwantedProducts);
                }
            });
        });
    }

    removeProductsFromCart(productKeywords) {
        const keywordsArray = commonPage.ensureArray(productKeywords);
        let productsRemoved = [];
        return cy.get('[data-test="inventory-item-name"]').each(($el) => {
            const productName = $el.text().trim();
            keywordsArray.some((keyword) => {
                if (productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Info] Removing ${productName} from the cart..`, specFile: Cypress.spec.relative });
                    cy.wrap($el)
                        .parentsUntil('.inventory_item')
                        .children('.item_pricebar').children('button')
                        .contains('Remove')
                        .click();
                    productsRemoved = commonPage.appendToList(productName, productsRemoved);
                    return true;
                } else if (!productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Warning] ${productName} is not a ${keyword}.`, specFile: Cypress.spec.relative });
                }
            });
        }).then(() => {
            Cypress.env('productsRemoved', productsRemoved);
            cy.task('logAction', { message: `[Success] ${Cypress.env('productsRemoved')} product(s) removed from the cart.`, specFile: Cypress.spec.relative });
        });
    }

    checkoutCart() {
        cy.task('logAction', { message: '[Info] Proceeding to checkout..', specFile: Cypress.spec.relative });
        cy.get('[data-test="checkout"]').click();
    }
}