import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';

dayjs.extend(utc);

const config = Cypress.env("api");
const baseUrl = config.baseUrl;
const now = dayjs().utc().valueOf();
const regex = config.regex;

export class APIupdate {
    putUpdateUserSuccessfully(name, job) {
        cy.request({
            method: "PUT",
            url: `${baseUrl}/users/2`,
            failOnStatusCode: false,
            body: {
                name: name,
                job: job
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            const responseBody = response.body;
            expect(responseBody.name).to.eq(name);
            expect(responseBody.job).to.eq(job);
            expect(responseBody.updatedAt).to.match(new RegExp(regex.dateFormat.iso8601));
            const updatedAtTime = dayjs(responseBody.createdAt).utc().valueOf();
            expect(updatedAtTime).to.be.closeTo(now, 2000);
        });
    }

    patchUpdateUserSuccessfully(name, job) {
        cy.request({
            method: "PATCH",
            url: `${baseUrl}/users/2`,
            failOnStatusCode: false,
            body: {
                name: name,
                job: job
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            const responseBody = response.body;
            expect(responseBody.name).to.eq(name);
            expect(responseBody.job).to.eq(job);
            expect(responseBody.updatedAt).to.match(new RegExp(regex.dateFormat.iso8601));
            const updatedAtTime = dayjs(responseBody.createdAt).utc().valueOf();
            expect(updatedAtTime).to.be.closeTo(now, 2000);
        });
    }
}