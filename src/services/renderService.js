const fs = require("fs-extra");
const path = require("path");
const queueService = require("./queueService");

const STORAGE = process.env.ARG_STORAGE || "C:\\AI-Reel-Storage";

const PENDING = path.join(STORAGE, "queue", "pending");
const PROCESSING = path.join(STORAGE, "queue", "processing");

exports.start = async (data) => {

    console.log("======================================");
    console.log("[ENGINE] QUEUE ADD");
    console.log("Job ID :", data.id);
    console.log("Time   :", new Date().toISOString());
    console.log("======================================");

    const pendingFile = path.join(
        PENDING,
        `${data.id}.json`
    );

    const processingFile = path.join(
        PROCESSING,
        `${data.id}.json`
    );

    if (
        await fs.pathExists(pendingFile) ||
        await fs.pathExists(processingFile)
    ) {

        console.log("[ENGINE] Duplicate Job :", data.id);

        return {
            success: true,
            job: data.id,
            message: "Job Already Exists"
        };

    }

    await queueService.addJob(data);

    return {
        success: true,
        job: data.id,
        message: "Job Queued Successfully"
    };

};

exports.get = async () => {

    return await queueService.nextJob();

};

exports.clear = async () => {

    return true;

};