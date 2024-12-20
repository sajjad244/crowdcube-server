require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const donationCollection = client.db('campaignDB').collection('donation');
        // ! for firebase data
        const userCollection = client.db('campaignDB').collection('users');
        const campaignCollection = client.db('campaignDB').collection('campaign');
        // ? Database Name declaration for use 



        // ? receiving data from client {firebase-data} users related apis

        // ! get all users from database
        app.get('/users', async (req, res) => {
            const result = await userCollection.find({}).toArray();
            res.send(result);
        })

        // ! add campaign to database & receiving data from client
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        app.patch('/users/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email }; // filter by email
            const updateDoc = {
                $set: { lastSignInTime: req.body?.lastSignInTime }
            };
            const result = await userCollection.updateOne(filter, updateDoc,);
            res.send(result);
        })



        // ? receiving data from client donation related apis


        // ! get all donations from database
        app.get('/donations', async (req, res) => {
            const result = await donationCollection.find({}).toArray();
            res.send(result);
        })

        // ! get all data from email quarry

        app.get('/donations/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await donationCollection.find(query).toArray();
            res.send(result);
        })



        // ! add donation to database & receiving data from client
        app.post('/donations', async (req, res) => {
            const newDonation = req.body;
            const result = await donationCollection.insertOne(newDonation);
            res.send(result);
        })


        // ////////////////////////////////////////////////////////////////
        // ////////////////////////////////////////////////////////////////


        // ! add campaign to database & receiving data from client
        app.post('/addCampaign', async (req, res) => {
            const newCampaign = req.body;
            const result = await campaignCollection.insertOne(newCampaign);
            res.send(result);
        })

        // ! get all campaigns from database
        app.get('/myCampaigns', async (req, res) => {
            const result = await campaignCollection.find({}).toArray();
            res.send(result);
        })

        // ! get all data from email quarry
        app.get('/myCampaigns/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await campaignCollection.find(query).toArray();
            res.send(result);
        })

        // ! delete user from database for myCampaigns

        app.delete('/myCampaigns/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: new ObjectId(id) };
            const result = await campaignCollection.deleteOne(query);
            res.send(result);
        })



        // ! find single data for update
        app.get('/myCampaigns/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await campaignCollection.findOne(query);
            res.send(result);
        })

        app.patch('/myCampaigns/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    title: data?.title,
                    imageURL: data?.imageURL,
                    description: data?.description,
                    type: data?.type,
                    minDonation: data?.minDonation,
                    deadline: data?.deadline,
                },
            }
            const result = await campaignCollection.updateOne(query, update);
            res.send(result);
        })

        // ! update status

        app.patch('/status/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    isCompleted: true,
                },
            }
            const result = await campaignCollection.updateOne(query, update);
            res.send(result);
        })


        // ////////////////////////////////////////////////////////////////
        // ////////////////////////////////////////////////////////////////











        //    !!! need to delete last   {}___'
        // Connect the client to the server	(optional starting session)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

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