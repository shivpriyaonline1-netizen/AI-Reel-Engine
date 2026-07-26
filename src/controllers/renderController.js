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

exports.retryFailed = async (req, res) => {

    const queueId = req.body.queue_id;

    if (!queueId) {

        return res.status(400).json({

            success: false,
            message: "Queue ID is required"

        });

    }

    const success =
        await queueService.retryFailedJob(queueId);

    return res.json({

        success,
        message: success
            ? "Failed Job Requeued"
            : "Failed Job Not Found"

    });

};

exports.retryStuck = async (req, res) => {

    const queueId = req.body.queue_id;

    if (!queueId) {

        return res.status(400).json({

            success: false,
            message: "Queue ID is required"

        });

    }

    const success =
        await queueService.retryStuckJob(queueId);

    return res.json({

        success,
        message: success
            ? "Stuck Job Requeued"
            : "Stuck Job Not Found"

    });

};