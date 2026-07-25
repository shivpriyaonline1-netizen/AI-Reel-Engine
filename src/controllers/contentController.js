const renderService = require("../services/renderService");

exports.get = async (req, res) => {

    try {

        const job = await renderService.get();

        if (!job) {

            return res.json({
                success: false,
                message: "No Pending Job"
            });

        }

        return res.json({
            success: true,
            job
        });

    } catch (err) {

        return res.json({
            success: false,
            message: err.message
        });

    }

};