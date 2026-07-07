const fs = require("fs");
const path = require("path");

exports.start = (jobId) => {

    const failedDir = path.join(
        process.cwd(),
        "queue",
        "failed"
    );

    const pendingDir = path.join(
        process.cwd(),
        "queue",
        "pending"
    );

    const failed = path.join(
        failedDir,
        `${jobId}.json`
    );

    const pending = path.join(
        pendingDir,
        `${jobId}.json`
    );

    if (!fs.existsSync(failed)) {

        return {
            success: false,
            message: "Failed Job Not Found"
        };

    }

    if (!fs.existsSync(pendingDir)) {

        fs.mkdirSync(pendingDir, {
            recursive: true
        });

    }

    fs.renameSync(
        failed,
        pending
    );

    return {
        success: true,
        message: "Retry Queued"
    };

};