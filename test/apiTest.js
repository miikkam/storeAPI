const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const chaiJsonSchemaAjv = require('chai-json-schema-ajv');
chai.use(chaiJsonSchemaAjv);
const server = require('../server');

const serverAddress = "http://localhost:3000"
const userArraySchema = require('../schemas/UserArray.schema.json');
const postingArraySchema = require('../schemas/PostingArray.schema.json');

describe('API Tests', function(){

    before(function(){
        server.start();
    });

    after(function() {
        server.close();
    })

    describe('GET /users', function(){
        it('should return all users', function(done){
            chai.request(serverAddress)
                .get('/users')
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);

                    expect(res.body).to.be.jsonSchema(userArraySchema);
                    done();
                })
        })
    })

    describe('Add new User', function() {
        it('should add new user when data is correct', function(done) {
            chai.request(serverAddress)
            .post('/users')
            .send({
                username: "jomppe",
                firstName : "pentti",     
                lastName: "mansikka",       
                email: "pena@gmail.com",
                password: "huor4",
                dateOfBirth: "1967-11-11",
                emailVerified: true,
                createDate : "2021-12-26"
            })
            .end(function(err, res){
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            }) 
        })
        it('should reject request with missing fields', function(done){
            chai.request(serverAddress)
            .post('/users')
            .send({
                username: "jomppe",
                firstName : "pentti",     
                lastName: "mansikka",       
                password: "huor4",
                dateOfBirth: "1967-11-11",
                emailVerified: true,
                createDate : "2021-12-26"
            })
            .end(function(err, res){
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            }) 
        })
        it('should reject request with incorrect data types', function(done) {
            chai.request(serverAddress)
            .post('/users')
            .send({
                username: "jomppe",
                firstName : 99,     
                lastName: "mansikka",       
                email: "pena@gmail.com",
                password: "huor4",
                dateOfBirth: "1967-11-11",
                emailVerified: true,
                createDate : "2021-12-26"
            })
            .end(function(err, res){
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            }) 
        })

    })

    describe('GET /postings', function(){
        it('should return all postings', function(done){
            chai.request(serverAddress)
                .get('/postings')
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);

                    expect(res.body).to.be.jsonSchema(postingArraySchema);
                    done();
                })
        })
    })
    /*
    describe('Add new Posting', function() {
        it('should add new posting when data is correct', function(done) {
            chai.request(serverAddress)
            .post('/postings')
            .send({
                title: "jomppe",
                description : "pentti",     
                category: "mansikka",       
                location: "pena@gmail.com",
                images: [
                    "a",
                    "b"
                ],
                price: 19.66,
                deliveryType: {
                    "shipping": true,
                    "pickup": true
                },
                dateOfPosting : "2021-12-26"
            })
            .end(function(err, res){
                expect(new Map([['a', 1], ['b', 1]])).to.include(2);
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            }) 
        }) 
        it('should reject request with missing fields', function(done){
            chai.request(serverAddress)
            .post('/postings')
            .send({
                description : "pentti",     
                category: "mansikka",       
                location: "pena@gmail.com",
                images: ["afasfsafas", "asfasffa"],
                price: 19.66,
                deliveryType: {
                    "shipping": true,
                    "pickup": true
                },
                dateOfPosting : "2021-12-26"
            })
            .end(function(err, res){
                expect(err).to.be.null;
                expect(res).to.have.status(500);
                done();
            }) 
        })
        it('should reject request with incorrect data types', function(done) {
            chai.request(serverAddress)
            .post('/postings')
            .send({
                title: "jomppe",
                description : 35353,     
                category: "mansikka",       
                location: "pena@gmail.com",
                images: ["asgasgag", "asgagag"],
                price: 19.66,
                deliveryType: {
                    "shipping": true,
                    "pickup": true
                },
                dateOfPosting : "2021-12-26"
            })
            .end(function(err, res){
                expect(err).to.be.null;
                expect(res).to.have.status(500);
                done();
            }) 
        })

    }) */
})

