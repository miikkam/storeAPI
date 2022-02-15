
const express = require('express');
const { append } = require('express/lib/response');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const Ajv = require('ajv');
const ajv = new Ajv();

const newUserSchema = require('./../schemas/newUser.schema.json');
const newUserValidator = ajv.compile(newUserSchema);

const userValidateMw = function(req, res, next) {

    const validatonResult = newUserValidator(req.body);
    if(validatonResult == true) {
        next();
    } else {
        res.sendStatus(400);
    }
}

const users = [
    {
        "id": uuidv4(),
        "username": "pena123",
        "firstName" : "Pentti",     
        "lastName": "Arajärvi",       
        "email": "pena@hotmail.com",
        "password": "penaonkingi",
        "dateOfBirth": "1965-04-23",
        "emailVerified" : true,       
        "createDate" : "2021-12-25"
    },
    {
        "id": uuidv4(),
        "username": "jorma666",
        "firstName" : "Hannu",     
        "lastName": "Jortikka",       
        "email": "pena@hotmail.com",
        "password": "saatana666",
        "dateOfBirth": "1963-08-04",
        "emailVerified" : true,       
        "createDate" : "2020-02-17"
    }
];

router.get('/', (req, res) => {
    res.json(users);
})


router.get('/:userID', (req, res) => {
 
    let foundIndex = -1;
    for(let i = 0; i < users.length; i++) {
        if(users[i].id === req.params.userID) {
            foundIndex = i;
            break;
        }
    }
 
     if(foundIndex === -1) {
         res.sendStatus(404);
     } else {
         res.json(users[foundIndex]);
     }
 })

 router.delete('/:userID', (req, res) => {

    let foundIndex = users.findIndex(t => t.id === req.params.userID);
 
     if(foundIndex === -1) {
         res.sendStatus(404);
     } else {
         users.splice(foundIndex, 1);
         res.sendStatus(200);
     }
 })

 router.post('/', userValidateMw, (req, res) => {
    console.log(req.body);

    const salt = bcrypt.genSaltSync(6);
    const hashedPassword =bcrypt.hashSync(req.body.password, salt);

        users.push({
            id: uuidv4(),
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            dateOfBirth: req.body.dateOfBirth,
            emailVerified: req.body.emailVerified,
            createDate: req.body.createDate
        });
        res.sendStatus(201);
 });
 
 module.exports = router;
 module.exports.userlist = users;

 