const express = require("express");
const path = require("path");
const userModel= require("./config").userModel;
const tripModel= require("./config").tripModel;
const ReviewModel= require("./config").reviewModel;
const bcrypt = require('bcrypt');
const islandsData= require("/Users/andreaparadiso/Desktop/Progetto_CI/api/islands.js");
const mongoose = require('mongoose');


const app = express();
// convert data into json format


app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("homepage");
});

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/home",(req,res)=> {
    res.render("home");
})

app.get("/choosetrip", (req, res) => {
    res.render("choosetrip", { islandsData });
});

app.get("/partner", (req,res)=>{
    res.render("insertpartner");
})

app.get("/writetestimony", (req,res)=>{
    res.render("writetestimony");
})



// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        last_name: req.body.last_name,
        email: req.body.email,
        address: req.body.address,
        nationality: req.body.nationality,
        city: req.body.city,
        state: req.body.state,
        password: req.body.password,
    }

    try {
        // Check if the username already exists in the database
        const existingUser = await userModel.findOne({ email: data.email });

        if (existingUser) {
            return res.render("signup", { error: 'emailExist' });
        } else {
            // Hash the password using bcrypt
            const saltRounds = 10; // Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            // Replace the original password with the hashed one
            data.password = hashedPassword;

            // Use create instead of insertMany for a single document
            const newUser = await userModel.create(data);
            console.log(newUser);

            res.render("signup", { success: 'success' })
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await userModel.findOne({ email: req.body.email });
        if (!check) {
            return res.render("login", { error: 'emailNotFound' });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.render("login", { error: 'incorrectPassword' });
        }
        res.render("auth", { email: req.body.email, logout: false });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});




app.get("/logout", async (req, res) => {
    try {
        res.render("auth", {email:"", logout:true });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});





//post a review for a city
app.post('/api/reviews', async (req, res) => {
    try {
      const { username, island, rating, description } = req.body;
  
      // Find the user by username
      const user = await userModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new review
      const newReview = new ReviewModel({
        island,
        rating,
        description,
      });


  

      user.cityReviews = user.cityReviews?.length > 0 ?  user.cityReviews : []
      // Add the review to the user's cityReviews array
      user.cityReviews.push(newReview);
  
      // Save the updated user document
      await user.save();
  
      res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.get('/api/:username', async (req, res) => {
    try {
      const { username } = req.params;
  
      // Find the user by username
      const user = await userModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  app.post('/choosetrip', async (req, res) => {
    try {
        const { selectedIslands, email, status} = req.session.body;


        // Find the user in the database based on the email
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        // Create a new trip with the selected islands
        const newTrip = new tripModel({
            cities: selectedIslands,
            status: status
        });

        // Add the new trip to the user's trips array
        user.trips = user.trips || [];
        user.trips.push(newTrip);

        // Save the updated user document in the database
        await user.save();

        res.json({ message: 'Trip saved successfully.' });
    } catch (error) {
        console.error('Error saving trip:', error);
        res.status(500).json({ error: 'Error saving trip.' });
    }
});


app.get('/complete', async (req, res) => {
    try {
        const userEmail = 'andrea@live.it';
        const userData = await userModel.findOne({ email: userEmail });
        const status= 'not completed';

        if (!userData) {
            return res.status(404).send('Utente non trovato');
        }

        console.log('userData:', userData); // Aggiunto per il debug
        res.render('completetrip', { userData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore del server');
    }
});





// Define Port for Application
const port = 2323;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});