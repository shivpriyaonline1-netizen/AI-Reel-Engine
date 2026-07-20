const fs = require("fs");
const path = require("path");

exports.remove = (jobId) => {
    try {
        const dir = path.join(process.cwd(), "output", String(jobId));

        if (fs.existsSync(dir)) {
            fs.rmSync(dir, {
                recursive: true,
                force: true
            });

            console.log(`[CLEANUP] Deleted output/${jobId}`);
        }
    } catch (err) {
        console.error("[CLEANUP ERROR]", err);
    }
};