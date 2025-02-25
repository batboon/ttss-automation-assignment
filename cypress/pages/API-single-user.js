const config = Cypress.env("api");
const baseUrl = config.baseUrl;
const user = config.users.get;

export class APIsingleUser {
    getUserSuccessfully() {
        cy.request({
            method: "GET",
            url: `${baseUrl}/users/2`,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(200);
            const responseBody = response.body;
            const data = responseBody.data;
            expect(data.id).to.eq(user.data.id);
            expect(data.email).to.eq(user.data.email);
            expect(data.first_name).to.eq(user.data.first_name);
            expect(data.last_name).to.eq(user.data.last_name);
            expect(data.avatar).to.eq(user.data.avatar);
            const support = responseBody.support;
            expect(support.url).to.eq(user.support.url);
            expect(support.text).to.eq(user.support.text);
        });
    }
}