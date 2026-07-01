const fs = require("fs");
const path = require("path");

const QUEUE_DIR = path.join(process.cwd(), "queue");

if (!fs.existsSync(QUEUE_DIR)) {
    fs.mkdirSync(QUEUE_DIR, { recursive: true });
}

exports.add = (job) => {

    const file = path.join(
        QUEUE_DIR,
        `${job.id}.json`
    );

    fs.writeFileSync(
        file,
        JSON.stringify({
            id: job.id,
            status: "pending",
            created_at: new Date().toISOString()
        }, null, 4)
    );

};