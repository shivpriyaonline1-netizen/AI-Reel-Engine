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

    try {

        const statusFile = path.join(
            process.cwd(),
            "storage",
            "status.json"
        );

        console.log("Status File :", statusFile);

        const raw = fs.readFileSync(statusFile, "utf8");
        console.log("RAW :", raw);

        let status = JSON.parse(raw);

        if (!status.currentJob) {
    status.currentJob = {
        id: null,
        title: null,
        stage: "Idle",
        progress: 0,
        startedAt: null
    };
}

        status.currentJob.id = req.body.id;
        status.currentJob.stage = req.body.stage;
        status.currentJob.progress = req.body.progress ?? 0;
        status.currentJob.startedAt = req.body.startedAt;

        fs.writeFileSync(
            statusFile,
            JSON.stringify(status, null, 4)
        );

        res.json({
            success: true
        });

    } catch (e) {

        console.error("Dashboard Job Error:");
        console.error(e);

        res.status(500).json({
            success: false,
            message: e.message
        });

    }

});

module.exports = router;