const express = require('express');
const app = express();
const cors = require('cors');
const mongodb = require('mongodb');
const DB = 'pyt';
const bcrypt = require('bcryptjs');
require('dotenv').config();
const URL = process.env.DB;

app.use(cors());
app.use(express.json());

app.get('/guest',async function(req,res){
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let guest = await db.collection('guests').find().toArray();
        res.json(guest);
    } catch (error) {
        console.log(error)
    }
})

app.post('/register',async function(req,res){
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        db.collection('guests').insertOne(req.body);
        res.json({
            message : "Registered"
        })
    } catch (error) {
        console.log(error)
    }
})

app.get('/guest/:id',async function(req,res){
    try {
        let id = req.params.id
    const ObjectId = require('mongodb').ObjectId;
    let o_id = new ObjectId(id)
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    let guest = await db.collection('guests').findOne({_id : o_id});
    res.json(guest);

    } catch (error) {
        console.log(error);
    }
})

app.post('/adminlogin',async function(req,res){
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let user = await db.collection('admin').findOne({ username: "admin" });
        if (user) {
            if (req.body.password == user.password) {
                id = user._id
                res.json({
                    message: "allow",
                })
            }
            else {
                res.status(404).json({
                    message: "Email or password incorrect"
                })
            }
        }
        else {
            res.status(404).json({
                message: "Email or password incorrect"
            })
        }
        connection.close

    } catch (error) {
        console.log(error)
    }
})


app.listen(process.env.PORT || 3030)
