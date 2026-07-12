const express = require("express");

const fs = require("fs");
const path = require("path");

const queueController = require("../controllers/queueController");

const router = express.Router();

router.get("/dashboard", (req, res) => {

    const stats = queueController.stats();

    let status = {
    renderer: {
        online: false,
        lastSeen: null
    }
};

try {

    status = JSON.parse(
        fs.readFileSync(
            path.join(process.cwd(), "storage", "status.json"),
            "utf8"
        )
    );

} catch (e) {}

    res.json({

        pending: stats.pending,
        processing: stats.processing,
        completed: stats.completed,
        failed: stats.failed,

        engine: "Running",
        queue: stats.pending + stats.processing,
        renderers: status.renderer.online ? 1 : 0,
renderer_status: status.renderer.online ? "Online" : "Offline",
heartbeat: status.renderer.lastSeen,
currentJob: status.currentJob

    });

});

router.post("/dashboard/job", (req, res) => {

    const statusFile = path.join(
        process.cwd(),
        "storage",
        "status.json"
    );

    let status = JSON.parse(
        fs.readFileSync(statusFile, "utf8")
    );

    status.currentJob.id = req.body.id;
    status.currentJob.stage = req.body.stage;
    status.currentJob.startedAt = req.body.startedAt;

    fs.writeFileSync(
        statusFile,
        JSON.stringify(status, null, 4)
    );

    res.json({
        success: true
    });

});

module.exports = router;