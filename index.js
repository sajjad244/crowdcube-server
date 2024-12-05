const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());


// ! mongoDb connection


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jdvna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // ? Database Name declaration for use 
        const campaignCollection = client.db('campaignDB').collection('campaign');
        // ? Database Name declaration for use 


        // ! get all campaigns from database
        app.get('/campaigns', async (req, res) => {
            const result = await campaignCollection.find({}).toArray();
            res.send(result);
        })



        // ! add campaign to database 
        app.post('/addCampaign', async (req, res) => {
            const newCampaign = req.body;
            console.log(newCampaign);
            const result = await campaignCollection.insertOne(newCampaign);
            res.send(result);
        })










        //    !!! need to delete last   {}___'
        // Connect the client to the server	(optional starting session)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        //    !!! need to delete last

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






// ! mongoDb connection 



// routes or server endpoints & start
app.get('/', (req, res) => {
    res.send('Assignment server is running...!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})