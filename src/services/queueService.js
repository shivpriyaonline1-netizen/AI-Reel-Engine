const fs = require("fs-extra");
const path = require("path");

const STORAGE = process.env.ARG_STORAGE || "C:\\AI-Reel-Storage";

const PENDING = path.join(STORAGE, "queue", "pending");
const PROCESSING = path.join(STORAGE, "queue", "processing");
const COMPLETED = path.join(STORAGE, "queue", "completed");
const FAILED = path.join(STORAGE, "queue", "failed");
const STATUS_FILE = path.join(STORAGE, "status.json");

async function ensureFolders() {
    await fs.ensureDir(PENDING);
    await fs.ensureDir(PROCESSING);
    await fs.ensureDir(COMPLETED);
    await fs.ensureDir(FAILED);
}

exports.init = ensureFolders;

exports.addJob = async (job) => {

    await ensureFolders();

    const pending = path.join(PENDING, `${job.queue_id}.json`);
    const processing = path.join(PROCESSING, `${job.queue_id}.json`);
    const completed = path.join(COMPLETED, `${job.queue_id}.json`);
    const failed = path.join(FAILED, `${job.queue_id}.json`);

    if (
        await fs.pathExists(pending) ||
        await fs.pathExists(processing) ||
        await fs.pathExists(completed) ||
        await fs.pathExists(failed)
    ) {
        console.log("[QUEUE] Duplicate Skipped :", job.queue_id);
        return false;
    }

    await fs.writeJson(pending, job, { spaces: 2 });

    console.log("[QUEUE] Added :", job.queue_id);

    return true;
};

async function addHistory(job, status) {

    let dashboard = {};

    if (await fs.pathExists(STATUS_FILE)) {

        dashboard = await fs.readJson(STATUS_FILE);

    }

    if (!Array.isArray(dashboard.history)) {
        dashboard.history = [];
    }

    dashboard.history.unshift({

        queue_id: job.queue_id,
        post_id: job.post_id,
        title: job.title || "",
        status,
        progress: job.progress || 100,
        startedAt: job.startedAt || null,
        completedAt: new Date().toISOString()

    });

    dashboard.history = dashboard.history.slice(0, 20);

    await fs.writeJson(
        STATUS_FILE,
        dashboard,
        { spaces: 4 }
    );

}

exports.nextJob = async () => {

    await ensureFolders();

    const files = (await fs.readdir(PENDING))
        .filter(file => file.endsWith(".json"))
        .sort((a, b) => parseInt(a) - parseInt(b));

    if (files.length === 0) {
        return null;
    }

    const file = files[0];

    const source = path.join(PENDING, file);
    const destination = path.join(PROCESSING, file);

    await fs.move(source, destination, {
    overwrite: true
});

const job = await fs.readJson(destination);

await addHistory(job, "Completed");

console.log("[QUEUE] Completed :", queueId);

return true;
};

exports.completeJob = async (queueId) => {

    await ensureFolders();

    const source = path.join(PROCESSING, `${queueId}.json`);

    if (!(await fs.pathExists(source))) {
        return false;
    }

    const destination = path.join(COMPLETED, `${queueId}.json`);

    await fs.move(source, destination, {
        overwrite: true
    });

    console.log("[QUEUE] Completed :", queueId);

    return true;
};

exports.failJob = async (queueId) => {

    await ensureFolders();

    const source = path.join(PROCESSING, `${queueId}.json`);

    if (!(await fs.pathExists(source))) {
        return false;
    }

    const destination = path.join(FAILED, `${queueId}.json`);

    await fs.move(source, destination, {
        overwrite: true
    });

    console.log("[QUEUE] Failed :", queueId);

    return true;
};