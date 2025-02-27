const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rjpks.mongodb.net/?appName=Cluster0`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Ensure connection only once
async function run() {
  try {
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const coffeeCollections = client.db("coffee_store").collection("coffee");


    app.get('/coffee', async (req, res) => {
      const result = await coffeeCollections.find().toArray();
      res.send(result);
    });


    app.post('/coffee', async(req, res)=>{
      const data = req.body;
      const result = await coffeeCollections.insertOne(data);
      res.send(result)
  })
  

  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

run(); // No .catch(console.dir) needed

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
