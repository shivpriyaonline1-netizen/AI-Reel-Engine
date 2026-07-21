const renderService = require("../services/renderService");

exports.get = (req, res) => {

    const content = renderService.get();

    if (!content) {

        return res.status(404).json({
            success: false,
            message: "No Current Job"
        });

    }

    res.json(content);

};