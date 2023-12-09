const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/Login");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

const reviewSchema = new mongoose.Schema({
    city: {
    type: String,
    required: true,
    },
    rating: {
    type: Number,
    required: true,
    },
    description: {
    type: String,
    },
});

const tripSchema = new mongoose.Schema({
    cities: [String], // An array of city names for each trip
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: false,
    },
});

// Create Schema
const Loginschema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    trips: [tripSchema], // An array of trips for each user
    CityReviews: [reviewSchema], // An array of reviews for each city
});


// collection part
const userModel = new mongoose.model("users", Loginschema);
const reviewModel = new mongoose.model("reviews", reviewSchema);
const tripModel = new mongoose.model("trips", tripSchema);

module.exports = {userModel,reviewModel,tripModel};