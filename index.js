const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

console.log(process.env.DB_PASS);

app.use(cors());
app.use(bodyParser.json());

const port = 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gaxfg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
client.connect(err => {
    const events = client.db("volunteerNetwork").collection("events");
    const users = client.db("volunteerNetwork").collection("users");
    // perform actions on the collection object
    console.log("db connected");

    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        events.insertOne(newEvent)
            .then(result => {
                res.send(result.insertOne > 0);
            })
        console.log(newEvent);
    })

    app.post('/addUser', (req, res) => {
        const newUser = req.body;
        users.insertOne(newUser)
            .then(result => {
                res.send(result.insertOne > 0);
            })
        console.log(newUser);
    })

    app.get('/events', (req, res) => {
        events.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/users', (req, res) => {
        const loggedInEmail = req.query.email;
        users.find({email:loggedInEmail})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        users.deleteOne({
            _id: ObjectId(req.params.id)
          })
          .then(result => {
            res.send(result.deletedCount>0);
          })
      })
});

app.get('/', (req,res)=>{
    res.send('Hello World!');
})


app.listen(process.env.PORT || port)