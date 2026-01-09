
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// 🔬 RAW body parser (ignores Postman quirks)
app.use(express.json());
app.use((req, res, next) => {
    if (req.body && Object.keys(req.body).length === 0) {
        try {
            req.bodyParsed = JSON.parse(req.body);
            console.log("🔧 Parsed raw body:", req.bodyParsed);
        } catch (e) {
            console.log("❌ Parse fail:", e.message);
            req.bodyParsed = {};
        }
    } else {
        req.bodyParsed = req.body;
    }
    next();
});

app.use((req, res, next) => {
    console.log("🌐", req.method, req.path);
    console.log("📦 Body length:", Object.keys(req.bodyParsed || {}).length);
    console.log("📦 Body:", JSON.stringify(req.bodyParsed, null, 2));
    req.body = req.bodyParsed;  // Pass to routes
    next();
});

console.log("🔄 Loading routes...");
const rootRouter = require("./routes/index");
console.log("✅ Routes loaded OK");
app.use("/api/v1", rootRouter);

app.use((err, req, res, next) => {
    console.error("💥 ERROR:", err);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
