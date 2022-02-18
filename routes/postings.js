const express = require('express')
const { append } = require('express/lib/response');
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const Ajv = require('ajv');
const ajv = new Ajv({strict: false});
var cloudinary = require('cloudinary').v4;
var { CloudinaryStorage } = require('multer-storage-cloudinary');
var multer = require('multer');
//const upload = multer({ dest : 'uploads/' });

var storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: ''
    },
  });

var parser = multer({ storage: storage });

const newPostingSchema = require('./../schemas/newPosting.schema.json');
const newPostingValidator = ajv.compile(newPostingSchema);

const postingValidateMw = function(req, res, next) {

    const validatonResult = newPostingValidator(req.body);
    if(validatonResult == true) {
        next();
    } else {
        res.sendStatus(400);
    }
}


const postings = [
    {
        "id": uuidv4(),
        "title" : "string",     
        "description": "string",       
        "category": "string",
        "location": "string",
        "price" : 9.99,
        "deliveryType": {

            "shipping": true,
    
            "pickup": true
    
        },
        "dateOfPosting" : "2021-12-25"
    },
    {
        "id": uuidv4(),
        "title" : "string",     
        "description": "string",       
        "category": "string",
        "location": "string",
        "images" : [
            "image1",
            "image2"
        ],
        "price" : 19,
        "deliveryType": {

            "shipping": true,
    
            "pickup": true
    
        },       
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

router.post('/', parser.single('image'), (req, res) => {
    console.log(req.body);


    postings.push({
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location,
        //images: req.files.map(file => file.path),
        images:req.file,
        price: req.body.price,
        deliveryType: req.body.deliveryType,
        dateOfPosting: req.body.dateOfPosting
    })
    res.sendStatus(201);

 });

router.put('/:postingId', parser.single('image'), (req, res) => {
    let foundPosting = postings.find(t => t.id === req.params.postingId);
    if(foundPosting) {
        foundPosting.title = req.body.title;
        foundPosting.description = req.body.description;
        foundPosting.category = req.body.category;
        foundPosting.location = req.body.location;
        //foundPosting.images = req.files.map(file => file.path),
        foundPosting =req.file;
        foundPosting.price = req.body.price;
        foundPosting.dateOfPosting = req.body.dateOfPosting;
        res.sendStatus(202);
    }
    else {
        res.sendStatus(404)
    }
 });


module.exports = router