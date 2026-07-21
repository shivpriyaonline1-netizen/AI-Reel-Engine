const fs = require("fs");
const path = require("path");

exports.remove = (jobId) => {

    console.log("======================================");
    console.log("[CLEANUP START]");
    console.log("Job ID :", jobId);
    console.log("Dir    :", path.join(process.cwd(), "output", String(jobId)));
    console.log("======================================");

    try {

        // existing code...
        const dir = path.join(process.cwd(), "output", String(jobId));

        console.log("Exists :", fs.existsSync(dir));

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