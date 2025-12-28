const express = require("express");
const cors = require("cors");

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//import routes
const rootRouter = require("./routes/index");


// using routes
app.use("/api/v1", rootRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
