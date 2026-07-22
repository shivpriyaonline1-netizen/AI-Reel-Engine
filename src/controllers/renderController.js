const config = require("../config/config");
const renderService = require("../services/renderService");

exports.render = async (req, res) => {

    console.log("======================================");
console.log("[RENDER API CALLED]");
console.log("Job ID :", req.body.id);
console.log("Time   :", new Date().toISOString());
console.log("======================================");

    console.log("RENDER ROUTE HIT");
    console.log(req.body);
    const result = await renderService.start(req.body);

    res.json({
        app: config.appName,
        version: config.version,
        ...result
    });

};

exports.complete = (req, res) => {

    renderService.clear();

    console.log("======================================");
    console.log("[RENDER COMPLETE]");
    console.log("Current Job Cleared");
    console.log("Time :", new Date().toISOString());
    console.log("======================================");

    res.json({
        success: true,
        message: "Current Job Cleared"
    });

};