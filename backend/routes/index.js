const express = require("express");
const userRouter = require("./user");     // ✅ Uncomment
const accountsRouter = require("./account");

const router = express.Router();

// Debug logs
console.log("✅ userRouter loaded:", !!userRouter);
console.log("✅ accountsRouter loaded:", !!accountsRouter);

router.use("/user/v1", userRouter);    // ✅ /api/v1/user/v1/signup
router.use("/account/v1", accountsRouter);

router.use('/test', (req, res) => res.json({ ok: 1 }));

module.exports = router;
