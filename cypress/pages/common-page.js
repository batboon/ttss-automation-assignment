export class CommonPage {
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

    updateProductsAddedToCart(productsAddedArray, productsInCartArray) {
        const updatedCart = productsAddedArray.concat(productsInCartArray);
        return updatedCart;
    }

    updateProductsRemovedFromCart(productsRemovedArray, productsInCartArray) {
        productsRemovedArray.forEach(item => {
            let index = productsInCartArray.indexOf(item);
            if (index !== -1) {
                productsInCartArray.splice(index, 1);
            }
        });
        return productsInCartArray;
    }

    addProductsToCart(productKeywords) {
        const keywordsArray = this.ensureArray(productKeywords);
        let productsAdded = [];

        return cy.get('[data-test="inventory-item-name"]').each(($el) => {
            const productName = $el.text().trim();
            keywordsArray.some((keyword) => {
                if (productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Info] Adding ${productName} to the cart..`, specFile: Cypress.spec.relative });
                    cy.wrap($el)
                        .parentsUntil('.inventory_item')
                        .children('.pricebar').children('button')
                        .contains('Add to cart')
                        .click();
                    productsAdded = this.appendToList(productName, productsAdded);
                    return true;
                } else if (!productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Warning] ${productName} is not a ${keyword}.`, specFile: Cypress.spec.relative });
                }
            });
        }).then(() => {
            Cypress.env('productsAdded', productsAdded);
            cy.task('logAction', { message: `[Info] ${Cypress.env('productsAdded')} product(s) added to the cart.`, specFile: Cypress.spec.relative });
        });
    }

    removeProductsFromCart(productKeywords) {
        const keywordsArray = this.ensureArray(productKeywords);
        let productsRemoved = [];
        return cy.get('[data-test="inventory-item-name"]').each(($el) => {
            const productName = $el.text().trim();
            keywordsArray.some((keyword) => {
                if (productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Info] Removing ${productName} from the cart..`, specFile: Cypress.spec.relative });
                    cy.wrap($el)
                        .parentsUntil('.inventory_item')
                        .children('.pricebar').children('button')
                        .contains('Remove')
                        .click();
                    productsRemoved = this.appendToList(productName, productsRemoved);
                    return true;
                } else if (!productName.includes(keyword)) {
                    cy.task('logAction', { message: `[Warning] ${productName} is not a ${keyword}.`, specFile: Cypress.spec.relative });
                }
            });
        }).then(() => {
            Cypress.env('productsRemoved', productsRemoved);
            cy.task('logAction', { message: `[Info] ${Cypress.env('productsRemoved')} product(s) removed from the cart.`, specFile: Cypress.spec.relative })
        });
    }

    goToCartScreen() {
        cy.task('logAction', { message: '[Info] Navigating to cart screen..', specFile: Cypress.spec.relative });
        cy.get('[data-test="shopping-cart-link"]').click();
    }
}