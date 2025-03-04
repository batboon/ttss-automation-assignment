export class CommonPage {
    // Todo: Replace cy.task() with log
    log(text) {
        cy.task('logAction', { message: text, specFile: Cypress.spec.relative });
    }

    goToUrl(url) {
        cy.task('logAction', { message: '[Info] Navigating to homepage..', specFile: Cypress.spec.relative });
        cy.visit(url);
    }

    inputUsernamePassword(username, password) {
        cy.task('logAction', { message: `[Info] Entering username: ${username}`, specFile: Cypress.spec.relative });
        cy.get('[data-test="username"]').type(username);

        cy.task('logAction', { message: `[Info] Entering password: ${password}`, specFile: Cypress.spec.relative });
        cy.get('[data-test="password"]').type(password);
    }

    loginToSite(username, password) {
        cy.task('logAction', { message: '[Info] Loging in with username and password..', specFile: Cypress.spec.relative });
        this.inputUsernamePassword(username, password);
        cy.get('[data-test="login-button"]').click();
    }

    ensureArray(input) {
        // Handle single string & array input
        if (Array.isArray(input)) {
            return input;
        } else if (!Array.isArray(input)) {
            return [input];
        }
    }

    appendToList(item, listOfProducts) {
        listOfProducts.push(item);
        return listOfProducts;
    }

    updateProductsAddedToCart(productsAddedArray) {
        cy.log('Before ' + productsAddedArray);
        if (Cypress.env('productsInCart')) {
            const productsInCartArray = Cypress.env('productsInCart');
            cy.log('First ' + productsInCartArray);
            const updatedCartArray = productsAddedArray.concat(productsInCartArray);
            Cypress.env('productsInCart', updatedCartArray);
            cy.log('Have ' + Cypress.env('productsInCart'));
        } else {
            Cypress.env('productsInCart', productsAddedArray);
            cy.log('No have ' + Cypress.env('productsInCart'));
        }
    }

    updateProductsRemovedFromCart(productsRemovedArray) {

        if (Cypress.env('productsInCart')) {
            const productsInCartArray = Cypress.env('productsInCart');
            cy.log('Before R ' + productsInCartArray);
            productsRemovedArray.forEach(item => {
                let index = productsInCartArray.indexOf(item);
                if (index !== -1) {
                    productsInCartArray.splice(index, 1);
                }
            });
            Cypress.env('productsInCart', productsInCartArray);
            cy.log('After R ' + Cypress.env('productsInCart'));
        }
    }

    clickAddToCartButton(itemName) {
        cy.wrap(itemName)
            .parentsUntil('.inventory_item')
            .children('.pricebar').children('button')
            .contains('Add to cart')
            .click();
    }

    addProductsToCart(productKeywords) {
        const keywordsArray = this.ensureArray(productKeywords);
        let productsAdded = [];

        return cy.get('[data-test="inventory-item-name"]').each((itemName) => {
            const productName = itemName.text().trim();
            keywordsArray.some((keyword) => {
                if (productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Info] Adding ${productName} to the cart..`, specFile: Cypress.spec.relative });
                    this.clickAddToCartButton(itemName);
                    productsAdded = this.appendToList(productName, productsAdded);
                    return true;
                } else if (!productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Warning] ${productName} is not a ${keyword}.`, specFile: Cypress.spec.relative });
                }
            });
        }).then(() => {
            this.updateProductsAddedToCart(productsAdded);
            cy.task('logAction', { message: `[Info] ${productsAdded} product(s) added to the cart.`, specFile: Cypress.spec.relative });
        });
    }

    clickRemoveButton(itemName) {
        cy.wrap(itemName)
            .parentsUntil('.inventory_item')
            .children('.pricebar').children('button')
            .contains('Remove')
            .click();
    }

    removeProductsFromCart(productKeywords) {
        const keywordsArray = this.ensureArray(productKeywords);
        let productsRemoved = [];
        return cy.get('[data-test="inventory-item-name"]').each((itemName) => {
            const productName = itemName.text().trim();
            keywordsArray.some((keyword) => {
                if (productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Info] Removing ${productName} from the cart..`, specFile: Cypress.spec.relative });
                    this.clickRemoveButton(itemName)
                    productsRemoved = this.appendToList(productName, productsRemoved);
                    return true;
                } else if (!productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Warning] ${productName} is not a ${keyword}.`, specFile: Cypress.spec.relative });
                }
            });
        }).then(() => {
            this.updateProductsRemovedFromCart(productsRemoved);
            cy.task('logAction', { message: `[Info] ${productsRemoved} product(s) removed from the cart.`, specFile: Cypress.spec.relative });
        });
    }

    goToCartScreen() {
        cy.task('logAction', { message: '[Info] Navigating to cart screen..', specFile: Cypress.spec.relative });
        cy.get('[data-test="shopping-cart-link"]').click();
    }
}