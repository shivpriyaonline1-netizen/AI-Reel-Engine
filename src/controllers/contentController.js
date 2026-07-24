const renderService = require("../services/renderService");

exports.get = async (req, res) => {

    const content = await renderService.get();

    if (!content) {

        return res.status(404).json({
            success: false,
            message: "No Pending Job"
        });

    }

    res.json(content);

};