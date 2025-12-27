import mongoose from "mongoose";
import { float32, maxLength, minLength } from "zod";
const {Schema} = mongoose;

mongoose.connect("mongodb://localhost:27017/paytmDB")

const userSchema = new Schema({
    username: {
        type: String,
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        minLength:3,
        maxLength:30,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
})

const accountsSchema = new Schema({
    userId: { //foreign key
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true,
    } 
})

const Account = mongoose.model("Account", accountsSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    Account
}