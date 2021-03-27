const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const objectId = require('mongodb').ObjectID
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4bol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
    const collection = client.db("Mytodo-list").collection("daily-routine");

    app.get('/list', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/lists/:id', (req, res) => {
        collection.find({ _id: objectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })

    })

    app.patch('/update/:id', (req, res) => {
        collection.updateOne({ _id: objectId(req.params.id) },
            {
                $set: { name: req.body.name, time: req.body.time, workingTime: req.body.workingTime }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })



    app.post('/addList', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                console.log('data added');
                res.redirect('/')
            })
    })

    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: objectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })



});




app.listen(process.env.PORT || 3000)