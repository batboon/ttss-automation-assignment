const config = Cypress.env("api")
const baseUrl = config.baseUrl

export class APIdelete {
    deleteUserSuccessfully() {
        cy.request({
            method: "DELETE",
            url: `${baseUrl}/users/2`,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(204);
        });
    }
}