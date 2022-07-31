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

    createDataBase() {
        cy.task('queryDb', "CREATE TABLE UserInfo (PersonID int NOT NULL , UserName varchar(255) NOT NULL , Email varchar(255) NOT NULL , Gender varchar(20),Status varchar(20))")

    },

    addUserInfoToDataBase(id, name, email, gender, status) {
        cy.task('queryDb', `INSERT INTO UserInfo (PersonID, UserName, Email, Gender, Status) VALUES (${id}, "${name}", "${email}", "${gender}", "${status}");`)
    },

    addAllUsersInfoToDataBase() {
        this.getUsers().then(res => {
            res.body.data.forEach(el => {
                this.addUserInfoToDataBase(el.id, el.name, el.email, el.gender, el.status)
            })
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
        this.getUsers().then(res => {
            if (res.body.code !== 429) {
                this.getTooManyUsers();
            } else {
                cy.log("429: Too many request!!!")
                expect(res.body.code).to.eq(429)
            }
        })
    }

}