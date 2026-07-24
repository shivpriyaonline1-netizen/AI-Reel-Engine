const fs = require("fs-extra");
const path = require("path");

const STORAGE = process.env.ARG_STORAGE || "C:\\AI-Reel-Storage";

const PENDING = path.join(STORAGE, "queue", "pending");
const PROCESSING = path.join(STORAGE, "queue", "processing");
const COMPLETED = path.join(STORAGE, "queue", "completed");
const FAILED = path.join(STORAGE, "queue", "failed");

async function ensureFolders() {

    await fs.ensureDir(PENDING);
    await fs.ensureDir(PROCESSING);
    await fs.ensureDir(COMPLETED);
    await fs.ensureDir(FAILED);

}

exports.init = ensureFolders;

exports.addJob = async (job) => {

    await ensureFolders();

    const pending = path.join(PENDING, `${job.id}.json`);
    const processing = path.join(PROCESSING, `${job.id}.json`);
    const completed = path.join(COMPLETED, `${job.id}.json`);
    const failed = path.join(FAILED, `${job.id}.json`);

    if (
        await fs.pathExists(pending) ||
        await fs.pathExists(processing) ||
        await fs.pathExists(completed)
    ) {

        console.log("[QUEUE] Duplicate Skipped :", job.id);

        return false;

    }

    await fs.writeJson(
        pending,
        job,
        {
            spaces: 2
        }
    );

    console.log("[QUEUE] Added :", job.id);

    return true;

};

exports.nextJob = async () => {

    await ensureFolders();

    const files = (await fs.readdir(PENDING))
        .filter(file => file.endsWith(".json"))
        .sort();

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

    console.log("[QUEUE] Started :", job.id);

    return job;

};

exports.completeJob = async (id) => {

    await ensureFolders();

    const source = path.join(PROCESSING, `${id}.json`);

    if (!(await fs.pathExists(source))) {
        return false;
    }

    const destination = path.join(COMPLETED, `${id}.json`);

    await fs.move(source, destination, {
        overwrite: true
    });

    console.log("[QUEUE] Completed :", id);

    return true;

};

exports.failJob = async (id) => {

    await ensureFolders();

    const source = path.join(PROCESSING, `${id}.json`);

    if (!(await fs.pathExists(source))) {
        return false;
    }

    const destination = path.join(FAILED, `${id}.json`);

    await fs.move(source, destination, {
        overwrite: true
    });

    console.log("[QUEUE] Failed :", id);

    return true;

};