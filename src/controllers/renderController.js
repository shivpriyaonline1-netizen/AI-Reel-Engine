const config = require("../config/config");
const renderService = require("../services/renderService");
const queueService = require("../services/queueService");

exports.render = async (req, res) => {

    console.log("======================================");
    console.log("[RENDER API CALLED]");
    console.log("Job ID :", req.body.id);
    console.log("Time   :", new Date().toISOString());
    console.log("======================================");

    const result = await renderService.start(req.body);

    res.json({
        app: config.appName,
        version: config.version,
        ...result
    });

};

exports.complete = async (req, res) => {

    const id = req.body.id;

    if (!id) {

        return res.status(400).json({
            success: false,
            message: "Job ID is required"
        });

    }

    const success = await queueService.completeJob(id);

    console.log("======================================");
    console.log("[RENDER COMPLETE]");
    console.log("Job ID :", id);
    console.log("Time   :", new Date().toISOString());
    console.log("======================================");

    res.json({
        success,
        message: success
            ? "Job Completed"
            : "Job Not Found"
    });

};

exports.fail = async (req, res) => {

    const id = req.body.id;

    if (!id) {

        return res.status(400).json({
            success: false,
            message: "Job ID is required"
        });

    }

    const success = await queueService.failJob(id);

    console.log("======================================");
    console.log("[RENDER FAILED]");
    console.log("Job ID :", id);
    console.log("Time   :", new Date().toISOString());
    console.log("======================================");

    res.json({
        success,
        message: success
            ? "Job Failed"
            : "Job Not Found"
    });

};