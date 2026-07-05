require("dotenv").config();

const path = require("path");
const uploadRoute = require("./src/routes/upload");

const express = require("express");
const routes = require("./src/routes");

const app = express();

app.use(express.json());
app.use(
    "/videos",
    express.static(
        path.join(__dirname, "public/videos")
    )
);

app.use("/", uploadRoute);

app.use("/", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 AI Reel Engine running on port ${PORT}`);
});