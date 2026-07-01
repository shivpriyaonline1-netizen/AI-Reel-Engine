const renderHtml = require("../renderer/renderHtml");

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

    const html = renderHtml.build(data);

fs.writeFileSync(
    path.join(jobDir, "index.html"),
    html
);

    return {
        success: true,
        job: jobId,
        message: "GitHub Auto Deploy Working"
    };

};