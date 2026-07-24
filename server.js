require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const uploadRoute = require("./src/routes/upload");
const routes = require("./src/routes");

const queueService = require("./src/services/queueService");
const wpService = require("./src/services/wpService");

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

let busy = false;

async function pollWordPress() {

    if (busy) {
        return;
    }

    busy = true;

    try {

        const response = await wpService.nextJob();

        if (response && response.success && response.job) {

            await queueService.addJob(response.job);

            console.log("[ENGINE] Job Synced :", response.job.id);

        }

    } catch (err) {

        console.log("[WP]", err.message);

    } finally {

        busy = false;

    }

}

app.listen(PORT, async () => {

    await queueService.init();

    console.log("====================================");
    console.log(" AI Reel Generator Engine");
    console.log(" Status : Running");
    console.log(" Port   :", PORT);
    console.log(" Storage:", process.env.ARG_STORAGE || "C:\\AI-Reel-Storage");
    console.log("====================================");

    await pollWordPress();

setInterval(pollWordPress, 5000);
});