const config = require("../config/config");
const renderService = require("../services/renderService");

exports.render = (req, res) => {

    const result = renderService.start(req.body);

    res.json({
        app: config.appName,
        version: config.version,
        ...result
    });

};