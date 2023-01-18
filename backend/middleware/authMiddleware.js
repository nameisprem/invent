const asyncHandler = require('express-async-handler')
const User = require("../models/userModel");
const jwt = require("jsonwebtoken")

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            res.status(401)
            throw new Error("Not Authorized, Please Login");
        }
        //verify token
        const verifed = jwt.verify(token, process.env.JWT_SECRET)

        //get user id from token
        const user = await User.findById(verifed.id).select("-password")

        if (!user) {
            res.status(401)
            throw new Error("user not found");
        }
        req.user = user
        next()

    } catch (error) {
        res.status(401)
        throw new Error("user is not authorized");
    }
})

module.exports = protect;