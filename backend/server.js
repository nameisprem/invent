const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors")


const app = express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Routes
app.get("/", (req, res) => {
    res.send("Home Page")
});

const PORT = process.env.PORT || 5000;

//Connect to Database

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port 5000`);
        })
    })
    .catch((error) => console.log(error));