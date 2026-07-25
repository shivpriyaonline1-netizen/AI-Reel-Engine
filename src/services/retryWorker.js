const fs = require("fs-extra");
const path = require("path");

const STORAGE = process.env.ARG_STORAGE || "C:\\AI-Reel-Storage";

const FAILED = path.join(STORAGE, "queue", "failed");
const PENDING = path.join(STORAGE, "queue", "pending");

exports.start = async (queueId) => {

    await fs.ensureDir(FAILED);
    await fs.ensureDir(PENDING);

    const failedFile = path.join(FAILED, `${queueId}.json`);

    if (!(await fs.pathExists(failedFile))) {

        return {
            success: false,
            message: "Failed Job Not Found"
        };

    }

    const pendingFile = path.join(PENDING, `${queueId}.json`);

    await fs.move(failedFile, pendingFile, {
        overwrite: true
    });

    return {
        success: true,
        queue_id: queueId,
        message: "Retry Queued"
    };

};