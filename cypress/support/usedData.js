const faker = require("@faker-js/faker").faker;

let token = '007526d9efdbc07e084ff7a6d4cfcc90588fbe20641c00faebf45a7f3b2eaf33';

module.exports = {

    randomStatus() {
        let status = Math.round(Math.random());
        if (status === 0) {
            return "active";
        } else {
            return "inactive";
        }
    },

    randomName() {
        return faker.name.firstName() + Date.now();
    },

    randomEmail() {
        return faker.internet.email();
    },

    randomGender() {
        return faker.name.gender(true);
    },



    getUsers() {
        return cy.request({
            method: "GET",
            url: '/users',
            headers: {
                Authorization: "Bearer " + token
            }
        })
    },

    postRandomUsers() {
        return cy.request({
            method: "POST",
            url: "/users",
            headers: {
                Authorization: "Bearer " + token
            },
            body: {
                name: this.randomName(),
                email: this.randomEmail(),
                gender: this.randomGender(),
                status: this.randomStatus()
            }
        })
    },

    postUsersWithInvalidToken() {
        return cy.request({
            method: "POST",
            url: "/users",
            headers: {
                Authorization: "Bearer " + token + 1
            },
            body: {
                name: this.randomName(),
                email: this.randomEmail(),
                gender: this.randomGender(),
                status: this.randomStatus()
            }
        })
    },

    postRandomUsersFail() {
        return cy.request({
            method: "POST",
            url: "/users",
            headers: {
                Authorization: "Bearer " + token
            },
            body: {}
        })
    },

    patchUser(userId) {
        return cy.request({
            method: "PATCH",
            url: "/users/" + userId,
            headers: {
                Authorization: "Bearer " + token
            },
            body: {
                "name": this.randomName() + "want to update",
                "email": "test" + this.randomEmail(),
                "gender": this.randomGender(),
                "status": this.randomStatus()
            }
        })
    },

    deleteUser(userId) {
        return cy.request({
            method: "DELETE",
            url: "/users/" + userId,
            headers: {
                Authorization: "Bearer " + token
            }
        })
    },

    getUserById(userId) {
        return cy.request({
            method: "GET",
            url: "/users/" + userId,
            headers: {
                Authorization: "Bearer " + token
            }
        })
    },

    getTooManyUsers() {
        for (let i = 0; i < 400; i++) {
            this.getUsers().its('body.code').should('not.eq', 429)

        }
    },

    getNotCorrectUsers() {
        for (let i = 0; i < 400; i++) {
            this.getUserById().its('body.code').should('not.eq', 429)
        }
    }


}