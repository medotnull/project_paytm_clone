const express = require("express");
const { User, Account} = require("../db");
const { authMiddleware } = require("../middleware"); 
const zod = require("zod");
const jwt = require("jsonwebtoken");

const router = express.Router();

const signupSchema = zod.object({
    username: zod.email(),
    password: zod.string().min(6),
    firstName: zod.string().min(1).max(30),
    lastName: zod.string().min(1).max(30),
})

// routing for user signup
router.post("/signup", async (req, res) => {
    const { success } = signupSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

const signinSchema = zod.object({
    username: zod.email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
     const { success } = signinSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateUserSchema = zod.object({
    password: zod.string().min(6),
    firstName: zod.string().max(30),
    lastName: zod.string().max(30)
})

router.put("/", authMiddleware, async (req, res) => {
    const {success} = updateUserSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne( req.body, {
         _id: req.userId
        });

    res.status(200).json({
        message: "Update successfully"
    })

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

