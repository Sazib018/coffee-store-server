const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const coffeeInfoCollections = client.db("coffee_store").collection("coffee");
    const usersCollections = client.db("coffee_store").collection("users");

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // json data get
    app.get("/coffee", async (req, res) => {
      const result = await coffeeInfoCollections.find().toArray()
      res.send(result)
    })


    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeInfoCollections.findOne(query)
      res.send(result)
    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeInfoCollections.deleteOne(query)
      res.send(result)
    })

    app.post('/coffee', async (req, res) => {
      const data = req.body;
      const result = await coffeeInfoCollections.insertOne(data);
      res.send(result)
    })

    app.get('/users', async (req, res) => {
      const result = await usersCollections.find().toArray()
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const data = req.body;
      const result = await usersCollections.insertOne(data);
      res.send(result)
    })

    app.patch('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email }
      const update = {
        $set: {
          lastSignInTime: user.lastSignInTime
        }
      }
      const result = await usersCollections.updateOne(query, update)
      res.send(result)
    })


    app.patch("/update_coffee/:id", async (req, res) => {
      const id = req.params.id;
      const coffeeUpdate = req.body;
      const query = { _id: new ObjectId(id) }

      const doc = {
        $set: {
          name: coffeeUpdate.name,
          chef: coffeeUpdate.chef,
          supplier: coffeeUpdate.supplier,
          details: coffeeUpdate.details,
          taste: coffeeUpdate.taste,
          category: coffeeUpdate.category,
          photo_Url: coffeeUpdate.photo_Url,
          price: coffeeUpdate.price
        }
      }
      const result = await coffeeInfoCollections.updateOne(query, doc)
      res.send(result)
    })


  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
