const mongoose = require('mongoose')
const {string} = require("joi");

const userSchema = new mongoose.Schema({
    email: String, //value is going to define the TYPE for this attribute in the schema
    foods: [{ name: String, calories: Number}],
    activities: [{ name: String, calories: Number,  imageUrl: String}],
    days: [{ Day: String, caloriesIn: Number, caloriesOut: Number}],

    //bestFriend: mongoose.SchemaTypes.ObjectId
    //stopped tutorial RIGHT HERE
})

module.exports = mongoose.model("heycoach", userSchema) //this will be the name of the collection we will see inside mongo, then pass it the schema

// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const blogSchema = new Schema({
//   title:  String, // String is shorthand for {type: String}
//   author: String,
//   body:   String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   meta: {
//     votes: Number,
//     favs:  Number
//   }
// });