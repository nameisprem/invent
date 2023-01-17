const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
        },
        email: {
            type: String,
            required: [true, "Please add a email"],
            unique: true,
            trim: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please enter a valid email"
            ]
        },
        password: {
            type: String,
            required: [true, "Please add a Password"],
            minLength: [6, "Password is too short"],
            maxLength: [23, "Password is too Long"],
        },
        photo: {
            type: String,
            required: [true, "Please add a Photo"],
            default: "https://i.ibb.co/4pDNDk1/avatar.png",
        },
        phone: {
            type: String,
            default: "+91",
        },
        bio: {
            type: String,
            maxLength: [250, "Bio must not be more than 250 characters"],
            default: "bio",
        },
    },

    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema)
module.exports = User