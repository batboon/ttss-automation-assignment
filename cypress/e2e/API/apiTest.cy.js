import { APIcreate } from "../../pages/API-create"
import { APIdelete } from "../../pages/API-delete";
import { APIsingleUser } from "../../pages/API-single-user";
import { APIupdate } from "../../pages/API-update";

const apiCreate = new APIcreate;
const apiDelete = new APIdelete;
const apiSingleUser = new APIsingleUser;
const apiUpdate = new APIupdate;

const config = Cypress.env("api");
const user = config.users.update;

describe("Assignment 2: API Test", () => {

    it("API Test 1: API POST /users 201 (CREATE)", () => {
        apiCreate.createUserSuccessfully(user.name, user.job);
        cy.task('logAction', 'CHECK API');
    })

    it("API Test 2: API GET /users/2 200 (SINGLE USER)", () => {
        apiSingleUser.getUserSuccessfully();
    })

    it("API Test 3: API PUT /users/2 200 (UPDATE)", () => {
        apiUpdate.putUpdateUserSuccessfully(user.name, user.job)
    })

    it("API Test 4: API PATCH /users/2 200 (UPDATE)", () => {
        apiUpdate.patchUpdateUserSuccessfully(user.name, user.job)
    })

    it("API Test 5: API DELETE /users/2 204 (DELETE)", () => {
        apiDelete.deleteUserSuccessfully();
    })
})