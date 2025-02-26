import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';

dayjs.extend(utc);

const config = Cypress.env("api");
const baseUrl = config.baseUrl;
const now = dayjs().utc().valueOf();
const regex = config.regex;

export class APIcreate {
    createUserSuccessfully(name, job) {
        cy.request({
            method: "POST",
            url: `${baseUrl}/users`,
            failOnStatusCode: false,
            body: {
                name: name,
                job: job
            },
        }).then((response) => {
            expect(response.status).to.equal(201);
            const responseBody = response.body;
            expect(responseBody.name).to.eq(name);
            expect(responseBody.job).to.eq(job);
            expect(responseBody.id).to.match(new RegExp(regex.numberString));
            expect(responseBody.createdAt).to.match(new RegExp(regex.dateFormat.iso8601));
            const createdAtTime = dayjs(responseBody.createdAt).utc().valueOf();
            expect(createdAtTime).to.be.closeTo(now, 3000);
        });
    }
}