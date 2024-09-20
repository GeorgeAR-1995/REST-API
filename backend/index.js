const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const cors = require('cors');
app.use(cors());

//Database
const items = [
    { id: 1, name: 'Golf Ball', description: `High-quality, beginner's ball x6`, price: '£30', quantity: "500", image: "http://localhost:3000/images/golfball.jpeg" },
    { id: 2, name: 'Iron set', description: `Beginner's iron set`, price: '£250', quantity: "25", image: "http://localhost:3000/images/golfironset.jpeg" },
    { id: 3, name: 'Tees', description: `High-quality, bamboo tees x25`, price: '£10', quantity: "1000", image: "http://localhost:3000/images/golftees.jpeg" },
    { id: 4, name: 'Shoes', description: `Comfy golf shoes, spikeless`, price: '£55', quantity: "50", image: "http://localhost:3000/images/golfshoes.jpeg" },
    { id: 5, name: 'Driver', description: `Forgiving driver for beginner's`, price: '£199', quantity: "100", image: "http://localhost:3000/images/golfdriver.jpeg" },
];

//Get Routes
app.get('/', (req, res) => {
    res.send('Golf Shop');
});

app.get('/api/items', (req, res) => {
    res.send(items);
});

app.get('/api/items/:id', (req, res) => {
    const item = items.find(c => c.id === parseInt(req.params.id));
    if (!item) {
        res.status(404).send('Item not in stock.')
    } else {
        res.send(item)
    }
});


//Post Route
app.post('/api/items', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };  

    const item = {
        id: items.length + 1,
        name: req.body.name
    };
    items.push(item);
    res.send(item);
})


//Put Route
app.put('/api/items/:id', (req, res) => {
    const item = items.find(c => c.id === parseInt(req.params.id));
    if (!item) {
        res.status(404).send('Item does not exist.')
        return;
    }

    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }; 

    item.name = req.body.name;
    res.send(item);
});


//Delete Route
app.delete('/api/items/:id', (req, res) => {
    const item = items.find(c => c.id === parseInt(req.params.id));
    if (!item) {
        res.status(404).send('Item does not exist.');
        return;
    }

    const index = items.indexOf(item);
    items.splice(index, 1);

    res.send(item);
})



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


// app.put();
// app.delete();

