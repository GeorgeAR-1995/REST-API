const express = require('express');

const app = express();


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

})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


// app.put();
// app.delete();

