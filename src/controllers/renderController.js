const config = require("../config/config");
const renderService = require("../services/renderService");
const queueService = require("../services/queueService");

exports.render = async (req, res) => {

    console.log("======================================");
    console.log("[RENDER API CALLED]");
    console.log("Queue ID :", req.body.queue_id);
    console.log("Post ID  :", req.body.post_id);
    console.log("Time     :", new Date().toISOString());
    console.log("======================================");

    const result = await renderService.start(req.body);

    res.json({
        app: config.appName,
        version: config.version,
        ...result
    });

};

exports.complete = async (req, res) => {

    const queueId = req.body.queue_id;

    if (!queueId) {

        return res.status(400).json({
            success: false,
            message: "Queue ID is required"
        });

    }

    const success = await queueService.completeJob(queueId);

    console.log("======================================");
    console.log("[RENDER COMPLETE]");
    console.log("Queue ID :", queueId);
    console.log("Time     :", new Date().toISOString());
    console.log("======================================");

    res.json({
        success,
        message: success
            ? "Job Completed"
            : "Job Not Found"
    });

};

exports.fail = async (req, res) => {

    const queueId = req.body.queue_id;

    if (!queueId) {

        return res.status(400).json({
            success: false,
            message: "Queue ID is required"
        });

    }

    const success = await queueService.failJob(queueId);

    console.log("======================================");
    console.log("[RENDER FAILED]");
    console.log("Queue ID :", queueId);
    console.log("Time     :", new Date().toISOString());
    console.log("======================================");

    res.json({
        success,
        message: success
            ? "Job Failed"
            : "Job Not Found"
    });

};