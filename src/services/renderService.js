const renderHtml = require("../renderer/renderHtml");

const fs = require("fs");
const path = require("path");
const puppeteer = require("../renderer/puppeteer");

exports.start = async (data) => {

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

await puppeteer.capture(
    path.join(jobDir, "index.html"),
    path.join(jobDir, "frame.png")
);

    return {
        success: true,
        job: jobId,
        message: "GitHub Auto Deploy Working"
    };

};