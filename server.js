const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const logger = require("morgan");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

app.use(logger("dev"));

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors()); // Use this after the variable declaration

// DB Config
const db = require("./config/keys").mongoURL;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

//Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const corsOptions = {
  Origin: "http//idsoftconnector.herokuapp.com",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://idsoftconnector.herokuapp.com"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("*", (req, res) => {
  let { sessionId, serviceCode, phoneNumber, text } = req.body;
  if (text == "") {
    // This is the first request. Note how we start the response with CON
    let response = `CON What would you want to check
    1. My Account
    2. My phone number`;
    res.send(response);
  } else if (text == "1") {
    // Business logic for first level response
    let response = `CON Choose account information you want to view
    1. Account number
    2. Account balance`;
    res.send(response);
  } else if (text == "2") {
    // Business logic for first level response
    let response = `END Your phone number is ${phoneNumber}`;
    res.send(response);
  } else if (text == "1*1") {
    // Business logic for first level response
    let accountNumber = "ACC1001";
    // This is a terminal request. Note how we start the response with END
    let response = `END Your account number is ${accountNumber}`;
    res.send(response);
  } else if (text == "1*2") {
    // This is a second level response where the user selected 1 in the first instance
    let balance = "NGN 10,000";
    // This is a terminal request. Note how we start the response with END
    let response = `END Your balance is ${balance}`;
    res.send(response);
  } else {
    res.status(400).send("Bad request!");
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
