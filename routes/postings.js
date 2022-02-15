const express = require('express')
const { append } = require('express/lib/response');
const router = express.Router()
const { v4: uuidv4 } = require('uuid');


const postings = [
    {
        "id": uuidv4(),
        "title" : "string",     
        "description": "string",       
        "category": "string",
        "location": "string",
        "price" : 9.99,       
        "dateOfPosting" : "2021-12-25"
    },
    {
        "id": uuidv4(),
        "title" : "string",     
        "description": "string",       
        "category": "string",
        "location": "string",
        "price" : 19,       
        "dateOfPosting" : "2021-11-29"
    }
];


router.get('/', (req, res) => {
    res.json(postings);
})


router.get('/:postingID', (req, res) => {
 
   let foundIndex = -1;
   for(let i = 0; i < postings.length; i++) {
       if(postings[i].id === req.params.postingID) {
           foundIndex = i;
           break;
       }
   }

    if(foundIndex === -1) {
        res.sendStatus(404);
    } else {
        res.json(postings[foundIndex]);
    }
})

router.delete('/:postingID', (req, res) => {

    let foundIndex = postings.findIndex(t => t.id === req.params.postingID);
 
     if(foundIndex === -1) {
         res.sendStatus(404);
     } else {
         postings.splice(foundIndex, 1);
         res.sendStatus(202);
     }
 })

router.post('/', (req, res) => {
    console.log(req.body);

    postings.push({
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location,
        price: req.body.price,
        dateOfPosting: req.body.dateOfPosting
    })
    res.sendStatus(201);

 });

router.put('/:postingId', (req, res) => {
    let foundPosting = postings.find(t => t.id === req.params.postingId);
    if(foundPosting) {
        foundPosting.title = req.body.title;
        foundPosting.description = req.body.description;
        foundPosting.category = req.body.category;
        foundPosting.location = req.body.location;
        foundPosting.price = req.body.price;
        foundPosting.dateOfPosting = req.body.dateOfPosting;
        res.sendStatus(202);
    }
    else {
        res.sendStatus(404)
    }
 });


module.exports = router