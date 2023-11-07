const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcnyajy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const foodCollection = client.db('foodDB').collection('allFood');
    const foodReqCollection = client.db('foodDB').collection('foodRequestCollection');


    // for sending data to database ( user requested food )
    app.post('/reqfood', async (req, res) => {
      const reqFood = req.body;
      console.log(reqFood);
      const result = await foodReqCollection.insertOne(reqFood);
      res.send(result);
    })


    // get all data from allFood 
    app.get('/allfood', async (req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    //for singleFoodDetails
    app.get('/allfood/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { foodName: 1, foodImage: 1, donator: 1, foodQuantity: 1, pickupLocation: 1, expiredDateTime: 1, additionalNotes: 1 },
      };

      const result = await foodCollection.findOne(query, options);
      res.send(result);
    })

    //data get for featured section on home page
    app.get('/featured-foods', async (req, res) => {
      try {
        const cursor = foodCollection.find()
          .sort({ foodQuantity: -1 })
          .limit(6);

        const result = await cursor.toArray();
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    // request food post on database 
    app.post()

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//for check server is running 
app.get('/', (req, res) => {
  res.send('server is running 11')
})

app.listen(port, () => {
  console.log(`eleven assignment server is running on ${port}`)
})

