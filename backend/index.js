const Joi = require('joi');
const express = require('express');
const multer = require('multer');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Save in the public/images folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

// Database
const items = [
    { id: 1, name: 'Golf Ball', description: `High-quality, beginner's ball x6`, price: 30, quantity: 500, image: "http://localhost:3000/images/golfball.jpeg" },
    { id: 2, name: 'Iron set', description: `Beginner's iron set`, price: 250, quantity: 25, image: "http://localhost:3000/images/golfironset.jpeg" },
    { id: 3, name: 'Tees', description: `High-quality, bamboo tees x25`, price: 10, quantity: 1000, image: "http://localhost:3000/images/golftees.jpeg" },
    { id: 4, name: 'Shoes', description: `Comfy golf shoes, spikeless`, price: 55, quantity: 50, image: "http://localhost:3000/images/golfshoes.jpeg" },
    { id: 5, name: 'Driver', description: `Forgiving driver for beginner's`, price: 199, quantity: 100, image: "http://localhost:3000/images/golfdriver.jpeg" },
];


// Get Routes
app.get('/', (req, res) => {
    res.send('Golf Shop');
});

app.get('/api/items', (req, res) => {
    res.send(items);
});

app.get('/api/items/:id', (req, res) => {
    const item = items.find(c => c.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).send('Item not in stock.');
    }
    res.send(item);
});

// Post Route to handle image uploads and new product creation
app.post('/api/items', upload.single('image'), (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required(),
        price: Joi.number().min(0).required(),  // Use number validation
        quantity: Joi.number().min(0).required(),
    });
    

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    if (!req.file) {
        return res.status(400).send('No image file uploaded.');
    }

    const item = {
        id: items.length + 1,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        image: `http://localhost:3000/images/${req.file.filename}`, // Correct URL
    };

    items.push(item);
    res.send(item);
});


// Put route for quantity updates
app.put('/api/items/:id/quantity', (req, res) => {
    const item = items.find(c => c.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).send('Item not found.');
    }

    const schema = Joi.object({
        quantity: Joi.number().min(0).required()
    });
    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    item.quantity = req.body.quantity;
    res.send(item);
});

// Put route for price updates
app.put('/api/items/:id/price', (req, res) => {
    const item = items.find(c => c.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).send('Item not found.');
    }

    const schema = Joi.object({
        price: Joi.number().min(0).required(), // Validate price as number
    });
    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    item.price = req.body.price;
    res.send(item);
});

// Delete Route
app.delete('/api/items/:id', (req, res) => {
    const item = items.find(c => c.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).send('Item does not exist.');
    }

    const index = items.indexOf(item);
    items.splice(index, 1);

    res.send(item);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
