const renderService = require("../services/renderService");

exports.get = async (req, res) => {

    const job = await renderService.get();

    if (!job) {

        return res.status(404).json({
            success: false,
            message: "No Pending Job"
        });

    }

    return res.json({
        success: true,
        job
    });

};