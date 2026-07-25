require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const uploadRoute = require("./src/routes/upload");
const routes = require("./src/routes");

const queueService = require("./src/services/queueService");

const app = express();

app.use(cors({
    origin: "https://shivpriyaonline.com"
}));

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

app.listen(PORT, async () => {

    await queueService.init();

    console.log("====================================");
    console.log(" AI Reel Engine");
    console.log(" Status :", "Running");
    console.log(" Port   :", PORT);
    console.log(" Storage:", process.env.ARG_STORAGE);
    console.log("====================================");

});