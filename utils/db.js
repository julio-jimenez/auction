const mongoose = require('mongoose');
const redis = require('redis');
require('dotenv').config();


const mongoDB = process.env.MONGO_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useFindAndModify: false });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const client = redis.createClient({
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST 
    })

module.exports = client