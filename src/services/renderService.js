const fs = require("fs-extra");
const path = require("path");
const queueService = require("./queueService");

const STORAGE = process.env.ARG_STORAGE || "C:\\AI-Reel-Storage";

const PENDING = path.join(STORAGE, "queue", "pending");
const PROCESSING = path.join(STORAGE, "queue", "processing");

exports.start = async (data) => {

    console.log("======================================");
    console.log("[ENGINE] QUEUE ADD");
    console.log("Queue ID :", data.queue_id);
    console.log("Post ID  :", data.post_id);
    console.log("Time      :", new Date().toISOString());
    console.log("======================================");

    const pendingFile = path.join(
        PENDING,
        `${data.queue_id}.json`
    );

    const processingFile = path.join(
        PROCESSING,
        `${data.queue_id}.json`
    );

    if (
        await fs.pathExists(pendingFile) ||
        await fs.pathExists(processingFile)
    ) {

        console.log("[ENGINE] Duplicate Queue :", data.queue_id);

        return {
            success: true,
            queue_id: data.queue_id,
            post_id: data.post_id,
            message: "Job Already Exists"
        };

    }

    await queueService.addJob(data);

    return {
        success: true,
        queue_id: data.queue_id,
        post_id: data.post_id,
        message: "Job Queued Successfully"
    };

};

exports.get = async () => {

    return await queueService.nextJob();

};

exports.clear = async () => {

    return true;

};