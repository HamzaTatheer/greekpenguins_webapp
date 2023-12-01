const mongoose = require("mongoose");
const connect= mongoose.connect("mongodb://localhost:27017/Login");

connect.then(()=>{
    console.log("Database connect Successfully");
})
.catch(()=>{
    console.log("Database cannot be connected")
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
  });
  
  const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },  
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    trips: [tripSchema], // An array of trips for each user
    CityReviews: [reviewSchema], // An array of reviews for each city
  });

const userModel = new mongoose.model("user", LoginSchema);
const reviewModel = new mongoose.mode("review",reviewSchema)


module.exports= {userModel,reviewModel};