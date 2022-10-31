const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// user:userdb
// pw:3Ov6r800kdLEES75



const uri = "mongodb+srv://userdb:3Ov6r800kdLEES75@cluster0.bshwcno.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      const userCollection = client.db("nodeMongoCrud").collection("users");

      app.get('/users',async(req,res) =>{
        const query = {};
        const cursor = userCollection.find(query);
        const users = await cursor.toArray();
        res.send(users);
      });

      app.get('/users/:id',async (req, res) =>{
        const id =req.params.id;
        const query = {_id:ObjectID(id)};
        const user = await userCollection.findOne(query);
        res.send(user);
      })


      app.post('/users', async(req, res)=>{
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user)
        res.send(result);
      })

      app.put('/users/:id',async(req, res)=>{
        const id = req.params.id;
        const query ={_id: ObjectID(id) }
        const user = req.body;
        const option ={upsert: true};
        const updatedUser ={
          $set:{
            name: user.name,
            email: user.email,
            address: user.address
          }
        }
        const result = await userCollection.updateOne(filter, updatedUser,option );
        result.send(result);




      })

      app.delete('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const query ={_id: ObjectID(id) }
        // console.log('trying to delete user',id);
        const result = await userCollection.deleteOne(query);
        console.log(result);
        res.send(result);
      })
    }
    finally {
      
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('hello from node mongo crud server');
})

app.listen (port, ()=>{
    console.log(`listening on port ${port}`);
})