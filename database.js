const mongoose = require('mongoose');

const mongoURL = "mongodb://localhost:27017";

const connectToMongoose = () => {
    mongoose.connect(mongoURL, ()=>{
        console.log("Connected to MongoDB");
    })
}

module.exports = connectToMongoose;