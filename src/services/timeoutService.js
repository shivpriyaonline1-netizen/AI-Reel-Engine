const queueService = require("./queueService");

const fs = require("fs-extra");
const path = require("path");

const config = require("../config/config");

const STORAGE = config.storage;

const PROCESSING = path.join(STORAGE, config.queue.processing);
const FAILED = path.join(STORAGE, config.queue.failed);

async function checkJobs() {

    try {

        await fs.ensureDir(PROCESSING);
        await fs.ensureDir(FAILED);

        const files = (await fs.readdir(PROCESSING))
            .filter(file => file.endsWith(".json"));

        for (const file of files) {

            try {

                const processingFile = path.join(PROCESSING, file);

                const job = await fs.readJson(processingFile);

                if (!job.startedAt) {
                    continue;
                }

                const elapsed =
                    Date.now() - new Date(job.startedAt).getTime();

                if (elapsed < config.timeout.render) {
                    continue;
                }

                job.status = "failed";
                job.reason = "Render Timeout";
                job.failedAt = new Date().toISOString();

                await fs.writeJson(processingFile, job, {
                    spaces: 2
                });

                const success = await queueService.failJob(job.queue_id);

if (success) {

    console.log(
        "[TIMEOUT] Failed :",
        job.queue_id
    );

}

            } catch (e) {

                console.log(
                    "[TIMEOUT]",
                    e.message
                );

            }

        }

    } catch (e) {

        console.log(
            "[TIMEOUT SERVICE]",
            e.message
        );

    }

}

exports.start = () => {

    setInterval(
        checkJobs,
        config.timeout.checkInterval
    );

};