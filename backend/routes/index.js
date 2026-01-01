const express = require("express");
const userRouter = require("./user");
const accountsRouter = require("./account")

const router = express.Router();

console.log("✅ userRouter loaded:", !!userRouter);
console.log("✅ accountsRouter loaded:", !!accountsRouter);

router.use("/user/v1", userRouter);
router.use("/account/v1", accountsRouter);

module.exports = router;