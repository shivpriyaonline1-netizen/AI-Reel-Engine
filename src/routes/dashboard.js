const express = require("express");

const queueController = require("../controllers/queueController");

const router = express.Router();

router.get("/dashboard", (req, res) => {

    const stats = queueController.stats();

    const lastSeen = queueController.getLastRendererContact();

const rendererOnline =
    lastSeen && (Date.now() - lastSeen) < 15000;

    res.json({

        pending: stats.pending,
        processing: stats.processing,
        completed: stats.completed,
        failed: stats.failed,

        engine: "Running",
        renderers: rendererOnline ? 1 : 0,
renderer_status: rendererOnline ? "Online" : "Offline",
        queue: stats.pending + stats.processing,
        heartbeat: lastSeen
    ? new Date(lastSeen).toISOString()
    : null

    });

});

module.exports = router;