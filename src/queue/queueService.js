const fs = require("fs");
const path = require("path");

const QUEUE_DIR = path.join(
    process.cwd(),
    "queue",
    "pending"
);

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
            created_at: new Date().toISOString()
        }, null, 4)
    );

};

function count(dir) {

    if (!fs.existsSync(dir)) {
        return 0;
    }

    return fs.readdirSync(dir)
        .filter(file => file.endsWith(".json"))
        .length;

}

exports.stats = () => {

    return {

        pending: count(path.join(process.cwd(), "queue", "pending")),

        processing: count(path.join(process.cwd(), "queue", "processing")),

        completed: count(path.join(process.cwd(), "queue", "completed")),

        failed: count(path.join(process.cwd(), "queue", "failed"))

    };

};