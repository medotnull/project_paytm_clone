const mongoose = require("mongoose");
const config = require('./routes/config');
const {Schema} = mongoose;

// db.js
mongoose.connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

mongoose.connection.on('error', err => console.error('DB error:', err));


const userSchema = new Schema({
    username: {
        type: String,
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        minLength:3,
        maxLength:30,
        match: /.+\@.+\..+/,
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


module.exports = { User, Account};