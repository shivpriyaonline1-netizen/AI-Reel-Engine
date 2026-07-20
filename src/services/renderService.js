const fs = require("fs");
const path = require("path");

const queueService = require("../queue/queueService");

exports.start = async (data) => {

    const jobId = data.id;

    const jobDir = path.join(process.cwd(), "output", String(jobId));

    if (!fs.existsSync(jobDir)) {
        fs.mkdirSync(jobDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(jobDir, "content.json"),
        JSON.stringify(data, null, 4)
    );

    // queueService.add(data);

    return {
        success: true,
        job: jobId,
        message: "Job Queued Successfully"
    };

};