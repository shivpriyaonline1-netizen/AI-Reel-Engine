const config = require("../config/config");
const renderService = require("../services/renderService");

exports.render = async (req, res) => {

    const result = await renderService.start(req.body);

    res.json({
        app: config.appName,
        version: config.version,
        ...result
    });

};