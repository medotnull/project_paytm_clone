require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit process on connection failure
  });
  

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed through app termination');
  process.exit(0);
});


const userSchema = new mongoose.Schema({
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

const accountsSchema = new mongoose.Schema({
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
};