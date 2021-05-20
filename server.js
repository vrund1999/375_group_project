const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const body_parser = require("body-parser");

// parse JSON (application/json content-type)
app.use(body_parser.json());

const port = 4000;


const uri = "mongodb+srv://sarthak:sarthak@cluster0.g7wkj.mongodb.net/375?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("375").collection("Doc1");
  console.log(`database connected`)
  client.close();
});

app.listen(port, () => {
    console.log(`server listening at ${port}`);
});