const fs = require("fs");
const path = require("path");

exports.start = (data) => {

    const jobId = data.id;

    const jobDir = path.join(__dirname, "../../output", String(jobId));

    if (!fs.existsSync(jobDir)) {
        fs.mkdirSync(jobDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(jobDir, "job.json"),
        JSON.stringify(data, null, 4)
    );

    return {
        success: true,
        job: jobId,
        message: "Job Saved"
    };

};