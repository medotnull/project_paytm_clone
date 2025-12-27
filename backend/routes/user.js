const express = require("express");
const { User } = require("../db");
const { authMiddleware } = require("../middleware"); 
const zod = require("zod");
const router = express.router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../routes/config");


const signupSchema = zod.object({
    username: zod.string().min(3).max(30),
    password: zod.string().min(6),
    firstName: zod.string().max(30),
    lastName: zod.string().max(30),
})

const signinSchema = zod.object({
    username: zod.string().z.email(),
    password: zod.string()
})

const updateUserSchema = zod.object({
    password: zod.string().min(6),
    firstName: zod.string().max(30),
    lastName: zod.string().max(30)
})




//routing for user signup
router.post("/signup", async (req, res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(body); //parse only valid data from body

    if(!success){
        return res.json({
            message: "Email already taken / Incorrect inputs",
        })
    }
    
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            message: "Email already taken/ Incorrect inputs"
        })
    }

    // creating a new user
    const user = await User.create({
        username: req.body.username,
        password: hashPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    const userId = user._id;

     await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })
    
    const token = jwt.sign({ userId }, JWT_SECRET, {expiresIn: "1h"}
    )

    res.status(200).json({
        message: "User created successfully", token
    })
})


router.post("/signin", async (req, res) => {
    const {success} = signinSchema.safeParse(req.body)
    if(!sucess){
        return res.status(411).json({
            message: "Email already taken/ Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })
    if(!user){
        return res.status(411).json({
            message: "Error while logging in"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(411).json({
            message: "Error while logging in"
        })
    }

    const userId = user._id;
    const token = jwt.sign({ userId}, JWT_SECRET, {expiresIn: "1h"})
    res.status(200).json({
        token
    })
})


router.put("/", authMiddleware, async (req, res) => {
    const {success} = updateUserSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({ _id: req.userId}, req.body);

    res.status(200).json({
        message: "Update successfully"
    })

    const userId = user.req.userId;
})


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{ // does multiple searches
            firstName: {
                "$regex": filter // to do partial matching with like searches
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router;