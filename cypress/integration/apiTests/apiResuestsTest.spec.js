/// <reference types="cypress" />

const needData = require('../../support/usedData')

describe('GET, POST,PATCH,DELETE API requests', () => {

    it('GET user info into database and check ', () => {
        needData.addAllUsersInfoToDataBase();
    })


    it('GET user', () => {
        // 200 Response Code  
        needData.getUsers().then(resp => {
            expect(resp.body.code).to.be.equal(200)
            expect(resp.body.meta.pagination).has.property('limit', 10)
        })
    })


    it("POST user", () => {
        // 201 Response Code
        needData.postRandomUsers().then(response => {
            expect(response.body.code).to.be.equal(201)
        }).then(responce => {
            let userId = responce.body.data.id;
            let userName = responce.body.data.name;
            let useremail = responce.body.data.email;
            needData.getUserById(userId).then(responce => {
                expect(responce.body.data).has.property("id", userId);
                expect(responce.body.data).has.property("name", userName);
                expect(responce.body.data).has.property("email", useremail);
            })

        })
    })


    it("PATCH user", () => {
        // 201 Response Code
        needData.postRandomUsers().then(resp => {
            expect(resp.body.code).to.be.equal(201)
        }).then(resp => {
            let userId = resp.body.data.id;
            needData.patchUser(userId).then(resp => {
                let userName = resp.body.data.name;
                let useremail = resp.body.data.email;
                expect(resp.body.code).to.be.equal(200);
                expect(resp.body.data).has.property("id", userId);
                expect(resp.body.data).has.property("name", userName);
                expect(resp.body.data).has.property("email", useremail);
            })
        })
    })


    it("DELETE user", () => {
        // 204 Response Code
        needData.postRandomUsers().then(response => {
            expect(response.body.code).to.be.equal(201)
        }).then(responce => {
            let userId = responce.body.data.id;
            needData.getUserById(userId).then(responce => {
                expect(responce.body.data).has.property("id", userId);
                needData.deleteUser(userId).then(resp => {
                    expect(resp.body.code).to.be.equal(204);

                })
            })

        })
    })


    it("POST user with empty body", () => {
        // 422 Response Code
        needData.postRandomUsersFail().then(response => {
            expect(response.body.code).to.be.equal(422)
        })
    })


    it("DELETE and GET user", () => {
        // 404 Response Code
        needData.postRandomUsers().then(response => {
            expect(response.body.code).to.be.equal(201)
        }).then(responce => {
            let userId = responce.body.data.id;
            needData.getUserById(userId).then(responce => {
                expect(responce.body.data).has.property("id", userId);
                needData.deleteUser(userId).then(resp => {
                    expect(resp.body.code).to.be.equal(204);
                    needData.getUserById(userId).then(responce => {
                        expect(responce.body.code).to.be.equal(404);
                    })
                })
            })
        })

    })


    it("POST user with invalid token", () => {
        // 401 Response Code
        needData.postUsersWithInvalidToken().then(response => {
            expect(response.body.code).to.be.equal(401);
            let dataMessage = response.body.data.message;
            expect(dataMessage).to.be.eq('Authentication failed')
        })
    })


    it("GET too many user ", () => {
        // 429 Response Code
        needData.getTooManyUsers() // couldn't write assertion

    })


})