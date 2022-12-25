const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const ejs = require('ejs');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
//Here,you should add your own mongodb database url.
const url = '?';
const dbName = 'mydb';

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/save', (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    const db = client.db(dbName);
    const collection = db.collection('users');
    collection.insertOne({ name: name, age: age }, (err, result) => {
      res.redirect('/list');
      client.close();
    });
  });
});

app.get('/list', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    const db = client.db(dbName);
    const collection = db.collection('users');
    collection.find({}).toArray((err, docs) => {
      res.render('list', { users: docs });
      client.close();
    });
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
