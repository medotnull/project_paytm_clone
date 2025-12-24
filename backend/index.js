const express = require("express");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const rootRouter = require("./routes/index");
const userRouter = require("./routes/user");
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

const app = express();

app.use("/api/v1", rootRouter)
router.use("/user/v1 ", userRouter);
// route req bwith certain prefix over to another router, also used in middlewares

module.exports = router;