export class CommonPage {
    // Todo: Replace cy.task() with log
    logInfo(text) {
        cy.task('logAction', { message: `[Info] ${text}`, specFile: Cypress.spec.relative });
    }

    logWarning(text) {
        cy.task('logAction', { message: `[Warning] ${text}`, specFile: Cypress.spec.relative });
    }

    logSuccess(text) {
        cy.task('logAction', { message: `[Success] ${text}`, specFile: Cypress.spec.relative });
    }

    goToUrl(url) {
        this.logInfo('Navigating to homepage..');
        cy.visit(url);
    }

    inputUsernamePassword(username, password) {
        this.logInfo(`Entering username: ${username}`);
        cy.get('[data-test="username"]').type(username);

        this.logInfo(`Entering username: ${password}`);
        cy.get('[data-test="password"]').type(password);
    }

    loginToSite(username, password) {
        this.logInfo('Loging in with username and password..');
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
                    this.logInfo(`Adding ${productName} to the cart..`);
                    this.clickAddToCartButton(itemName);
                    productsAdded = this.appendToList(productName, productsAdded);
                    return true;
                } else if (!productName.includes(keyword)) {
                    this.logWarning(`${productName} is not a ${keyword}.`);
                }
            });
        }).then(() => {
            this.updateProductsAddedToCart(productsAdded);
            this.logInfo(`${productsAdded} product(s) added to the cart.`);
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
                    this.logInfo(`Removing ${productName} from the cart..`);
                    this.clickRemoveButton(itemName)
                    productsRemoved = this.appendToList(productName, productsRemoved);
                    return true;
                } else if (!productName.includes(keyword)) {
                    this.logWarning(`${productName} is not a ${keyword}.`);
                }
            });
        }).then(() => {
            this.updateProductsRemovedFromCart(productsRemoved);
            this.logInfo(`${productsRemoved} product(s) removed from the cart.`);
        });
    }

    goToCartScreen() {
        this.logInfo('Navigating to cart screen..');
        cy.get('[data-test="shopping-cart-link"]').click();
    }
}