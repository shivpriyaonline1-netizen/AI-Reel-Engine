const fs = require("fs-extra");
const path = require("path");

const STORAGE = process.env.ARG_STORAGE || "C:\\AI-Reel-Storage";

const FAILED = path.join(STORAGE, "queue", "failed");
const PENDING = path.join(STORAGE, "queue", "pending");

exports.start = async (queueId) => {

    await fs.ensureDir(FAILED);
    await fs.ensureDir(PENDING);

    const failed = path.join(
        FAILED,
        `${queueId}.json`
    );

    const pending = path.join(
        PENDING,
        `${queueId}.json`
    );

    if (!(await fs.pathExists(failed))) {

        return {
            success: false,
            message: "Failed Job Not Found"
        };

    }

    await fs.move(
        failed,
        pending,
        {
            overwrite: true
        }
    );

    return {
        success: true,
        queue_id: queueId,
        message: "Retry Queued"
    };

};