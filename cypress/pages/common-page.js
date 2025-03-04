const config = Cypress.env("web");

export class CommonPage {
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
        if (Cypress.env('productsInCart')) {
            const productsInCartArray = Cypress.env('productsInCart');
            const updatedCartArray = productsAddedArray.concat(productsInCartArray);
            Cypress.env('productsInCart', updatedCartArray);
        } else {
            Cypress.env('productsInCart', productsAddedArray);
        }
    }

    updateProductsRemovedFromCart(productsRemovedArray) {
        cy.then(() => {
            const productsInCartArray = Cypress.env('productsInCart');
            productsRemovedArray.forEach(item => {
                let index = productsInCartArray.indexOf(item);
                if (index !== -1) {
                    productsInCartArray.splice(index, 1);
                }
            });
            Cypress.env('productsInCart', productsInCartArray);
        })
    }

    clickButtonOnItem(button, itemName) {
        cy.wrap(itemName)
            .parentsUntil('.inventory_item')
            .children('.pricebar').children('button')
            .contains(button)
            .click();
    }

    clickAddToCartButton(itemName) {
        this.clickButtonOnItem(config.buttons.addToCart, itemName);
    }

    clickRemoveButton(itemName) {
        this.clickButtonOnItem(config.buttons.remove, itemName);
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