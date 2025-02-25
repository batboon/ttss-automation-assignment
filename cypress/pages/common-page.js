export class CommonPage {
    goToUrl(url) {
        cy.task('logAction', '[Info] Navigating to homepage..');
        cy.visit(url);
    }

    inputUsernamePassword(username, password) {
        cy.task('logAction', `[Info] Entering username: ${username}`);
        cy.get('[data-test="username"]').type(username);

        cy.task('logAction', `[Info] Entering password: ${password}`);
        cy.get('[data-test="password"]').type(password);
    }

    loginToSite(username, password) {
        cy.task('logAction', '[Info] Loging in with username and password..');
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
                    cy.task('logAction', `[Info] Adding ${productName} to the cart..`);
                    cy.wrap($el)
                        .parentsUntil('.inventory_item')
                        .children('.pricebar').children('button')
                        .contains('Add to cart')
                        .click();
                    productsAdded = this.appendToList(productName, productsAdded);
                    return true;
                } else if (!productName.includes(keyword)) {
                    cy.task('logAction', `[Warning] ${productName} is not a ${keyword}.`);
                }
            });
        }).then(() => {
            Cypress.env('productsAdded', productsAdded);
            cy.task('logAction', `[Info] ${Cypress.env('productsAdded')} product(s) added to the cart.`);
        });
    }

    removeProductsFromCart(productKeywords) {
        const keywordsArray = this.ensureArray(productKeywords);
        let productsRemoved = [];
        return cy.get('[data-test="inventory-item-name"]').each(($el) => {
            const productName = $el.text().trim();
            keywordsArray.some((keyword) => {
                if (productName.includes(keyword)) {
                    cy.task('logAction', `[Info] Removing ${productName} from the cart..`);
                    cy.wrap($el)
                        .parentsUntil('.inventory_item')
                        .children('.pricebar').children('button')
                        .contains('Remove')
                        .click();
                    productsRemoved = this.appendToList(productName, productsRemoved);
                    return true;
                } else if (!productName.includes(keyword)) {
                    cy.task('logAction', `[Warning] ${productName} is not a ${keyword}.`);
                }
            });
        }).then(() => {
            Cypress.env('productsRemoved', productsRemoved);
            cy.task('logAction', `[Info] ${Cypress.env('productsRemoved')} product(s) removed from the cart.`)
        });
    }

    goToCartScreen() {
        cy.task('logAction', '[Info] Navigating to cart screen..');
        cy.get('[data-test="shopping-cart-link"]').click();
    }
}