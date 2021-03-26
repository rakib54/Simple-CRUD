const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const objectId = require('mongodb').ObjectID
// const cors = require('cors')

const uri = "mongodb+srv://Mytodolist:rakib1234@cluster0.c4bol.mongodb.net/Mytodo-list?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cors())

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



    app.post('/addList', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                console.log('data added');
                res.send('Successfully added')
            })
    })

    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: objectId(req.params.id) })
            .then(result => {
                console.log(result);
            })
    })



});




app.listen(3000)