const express = require("express");
const path = require("path");
const userModel= require("./config").userModel;
const tripModel= require("./config").tripModel;
const bcrypt = require('bcrypt');
const islandsData= require("/Users/andreaparadiso/Desktop/Progetto_CI/api/islands.js");

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
app.get("/complete", (req, res) => {
    res.render("completetrip");
});

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

        res.render("home");
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});


//post a review for a city
app.post('/api/reviews', async (req, res) => {
    try {
      const { username, city, rating, description } = req.body;
  
      // Find the user by username
      const user = await userModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new review
      const newReview = new ReviewModel({
        city,
        rating,
        description,
      });
  
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






app.post("/complete",async(req,res)=>{
    const data = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    }

    const newTrip = await tripModel.create(data);
    console.log(newTrip);
    res.render("completetrip", { success: 'success' })
})

 
// Define Port for Application
const port = 2323;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});