const asyncHandler = require('express-async-handler')
const User = require("../models/userModel");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

//register user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    //Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be up to 6 characters");
    }

    // Check if user email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("Email has already been registered");
    }


    // Create new user
    const user = await User.create({
        name,
        email,
        password,
        phone
    });

    //Generate Token using jwt
    const token = generateToken(user._id)

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
    });

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

//login user

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
        res.status(400);
        throw new Error("Please enter correct details");
    }

    //Check if user exists
    const user = await User.findOne({ email })

    if (!user) {
        res.status(400);
        throw new Error("User not found please signup");
    }

    // user exists, check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password)


    //Generate Token using jwt
    const token = generateToken(user._id)

    // Send HTTP-only cookie

    if (passwordIsCorrect) {
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 day
            sameSite: "none",
            secure: true,
        });
    }


    if (user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        });
    }
    else {
        res.status(400);
        throw new Error("Email or password invalid data");
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // instant expire
        sameSite: "none",
        secure: true,
    });

    return res.status(200).json({
        message: "User successfully logged out"
    })
})


const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
        });
    }
    else {
        res.status(400);
        throw new Error("user not found");
    }
});


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser
}