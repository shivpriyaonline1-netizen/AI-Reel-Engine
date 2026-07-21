const config = require("../config/config");
const renderService = require("../services/renderService");

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