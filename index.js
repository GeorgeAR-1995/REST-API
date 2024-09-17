const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const items = [
    { id: 1, name: 'Golf Ball' },
    { id: 2, name: '9 Iron' },
    { id: 3, name: 'Tees' },
    { id: 4, name: 'Shoes' },
    { id: 5, name: 'Driver' },
]

app.get('/', (req, res) => {
    res.send('Hello World');
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


app.put('/api/items/:id', (req, res) => {
    const item = items.find(c => c.id === parseInt(req.params.id));
    if (!item) {
        res.status(404).send('Item does not exist.')
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


app.delete('/api/items/:id', (req, res) => {
    const item = items.find(c => c.id === parseInt(req.params.id));
    if (!item) {
        res.status(404).send('Item does not exist.')
    }

    const index = items.indexOf(item);
    items.splice(index, 1);

    res.send(item);


})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


// app.put();
// app.delete();

