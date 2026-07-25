const queueService = require("../services/queueService");

exports.complete = async (req, res) => {

    const queueId = req.body.queue_id;

    if (!queueId) {
        return res.status(400).json({
            success: false,
            message: "Queue ID is required"
        });
    }

    const success = await queueService.completeJob(queueId);

    res.json({
        success,
        message: success ? "Job Completed" : "Job Not Found"
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

    res.json({
        success,
        message: success ? "Job Failed" : "Job Not Found"
    });

};