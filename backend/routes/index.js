const express = require("express");
const userRouter = require("./user");
const accountsRouter = require("./account")

const router = express.Router();

router.use("/user/v1 ", userRouter);
router.use("/account/v1", accountsRouter);

module.exports = router;