const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors")
const userRoute = require("./routes/userRoute")
const errorHandler = require('./middleware/errorMiddleware')
const cookieParser = require('cookie-parser')

const app = express()

//Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

//Route Middleware
app.use("/api/users", userRoute);

//Routes
app.get("/", (req, res) => {
    res.send("Home Page")
});


//Error middleware
app.use(errorHandler)

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