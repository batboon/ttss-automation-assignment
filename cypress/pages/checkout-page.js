import { CommonPage } from "./common-page";
const commonPage = new CommonPage();

export class CheckoutPage {
    enterCheckoutInfo(firstName, lastName, postalCode) {
        commonPage.logInfo(`Entering checkout information:\n
            First name: ${firstName}\n
            Last name: ${lastName}\n
            Postal: ${postalCode}`);
        cy.get('[data-test="firstName"]').type(firstName);
        cy.get('[data-test="lastName"]').type(lastName);
        cy.get('[data-test="postalCode"]').type(postalCode);
    }

    continueCheckout() {
        commonPage.logInfo('Continuing to checkout..');
        cy.get('[data-test="continue"]').click();
    }

    checkProductsToCheckout() {
        if (Cypress.env('productsInCart')) {
            const productsInCart = Cypress.env('productsInCart');
            const keywordsArray = commonPage.ensureArray(productsInCart);

            commonPage.logInfo('Checking items to checkout..');
            cy.get('[data-test="inventory-item-name"]').then(($els) => {
                const actualProductsInCartArray = $els.toArray()
                    .map(
                        el => el.textContent.trim()
                    );
                expect(actualProductsInCartArray.sort())
                    .to.deep.equal(keywordsArray.sort());
            });
        }
    }

    parseFloatFromElement(el) {
        parseFloat(el.textContent.trim().replace('$', ''));
    }

    calculateSubtotal() {
        return cy.get('[data-test="inventory-item-price"]').then((subtotalLabels) => {
            const calculatedSubtotal = subtotalLabels.toArray().reduce((sum, subtotalLabel) => {
                const price = parseFloat(subtotalLabel.textContent.trim().replace('$', ''));
                return sum + price;
            }, 0);
            return calculatedSubtotal;
        });
    }

    parseFloatFromLabel(label) {
        const dollarIndex = label.indexOf('$');
        const priceString = label.slice(dollarIndex + 1);
        const result = parseFloat(priceString);
        return result;
    }

    checkSubtotal() {
        commonPage.logInfo('Checking price total: Item total');
        cy.get('[data-test="subtotal-label"]').invoke('text').then((subtotalLabel) => {
            const actualSubtotal = this.parseFloatFromLabel(subtotalLabel);
            this.calculateSubtotal().then((calculatedSubtotal) => {
                expect(actualSubtotal).to.equal(calculatedSubtotal);
            });
        });
    }

    calculateTax() {
        return this.calculateSubtotal().then((calculatedSubtotal) => {
            const calculatedTax = parseFloat((calculatedSubtotal * 0.08).toFixed(2));
            return calculatedTax;
        });
    }

    checkTax() {
        commonPage.logInfo('Checking price total: Tax');
        cy.get('[data-test="tax-label"]').invoke('text').then((taxLabel) => {
            const actualTax = this.parseFloatFromLabel(taxLabel);
            this.calculateTax().then((calculatedTax) => {
                expect(actualTax).to.equal(calculatedTax);
            });
        });
    }

    calculateTotal() {
        return this.calculateSubtotal().then((calculatedSubtotal) => {
            return this.calculateTax().then((calculatedTax) => {
                const calculatedTotal = parseFloat((calculatedSubtotal + calculatedTax).toFixed(2));
                return calculatedTotal;
            });
        });
    }

    checkTotal() {
        commonPage.logInfo('Checking price total: Total');
        cy.get('[data-test="total-label"]').invoke('text').then((totalLabel) => {
            const actualTotal = this.parseFloatFromLabel(totalLabel);
            this.calculateTotal().then((calculatedTotal) => {
                expect(actualTotal).to.equal(calculatedTotal);
            });
        });
    }

    finishCheckout() {
        commonPage.logInfo('Finishing checkout..');
        cy.get('[data-test="finish"]').click();
        cy.get('[data-test="complete-header"]').should('contain', Cypress.env("web").messages.checkoutComplete.thankYou);
    }
}