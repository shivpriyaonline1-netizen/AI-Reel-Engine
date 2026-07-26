const express = require("express");
const fs = require("fs-extra");
const path = require("path");

const config = require("../config/config");

const router = express.Router();

const STORAGE = config.storage;
const STATUS_FILE = path.join(STORAGE, "status.json");

const PENDING = path.join(STORAGE, "queue", "pending");
const PROCESSING = path.join(STORAGE, "queue", "processing");
const COMPLETED = path.join(STORAGE, "queue", "completed");
const FAILED = path.join(STORAGE, "queue", "failed");

async function count(dir) {

    try {

        await fs.ensureDir(dir);

        const files = await fs.readdir(dir);

        return files.filter(file => file.endsWith(".json")).length;

    } catch {

        return 0;

    }

}

async function loadStatus() {

    const defaults = {

        engine: {
            status: "Running"
        },

        renderer: {
            online: false,
            lastSeen: null
        },

        currentJob: {
            queue_id: null,
            post_id: null,
            title: null,
            stage: "Idle",
            progress: 0,
            startedAt: null
        }

    };

    try {

        if (!(await fs.pathExists(STATUS_FILE))) {
            return defaults;
        }

        return {
            ...defaults,
            ...(await fs.readJson(STATUS_FILE))
        };

    } catch {

        return defaults;

    }

}

router.get("/dashboard", async (req, res) => {

    const status = await loadStatus();

    const pending = await count(PENDING);
    const processing = await count(PROCESSING);
    const completed = await count(COMPLETED);
    const failed = await count(FAILED);

    async function getJobs(folder) {

    const jobs = [];

    try {

        const files = (await fs.readdir(folder))
            .filter(file => file.endsWith(".json"))
            .sort();

        for (const file of files) {

            const job = await fs.readJson(
                path.join(folder, file)
            );

            jobs.push({

                queue_id: job.queue_id,
                post_id: job.post_id,
                title: job.title || "",
                stage: job.stage || "",
                progress: job.progress || 0

            });

        }

    } catch {}

    return jobs;

}

const failedJobs = await getJobs(FAILED);   

    res.json({

    success: true,

    pending,
    processing,
    completed,
    failed,

    total:
        pending +
        processing +
        completed +
        failed,

    queue:
        pending +
        processing,

    engine: status.engine.status,

    renderer: status.renderer,

    currentJob: status.currentJob,

    failedJobs

});

});

router.post("/dashboard/job", async (req, res) => {

    try {

        const status = await loadStatus();

        status.currentJob = {

            queue_id: req.body.queue_id ?? null,
            post_id: req.body.post_id ?? null,
            title: req.body.title ?? null,
            stage: req.body.stage ?? "Idle",
            progress: req.body.progress ?? 0,
            startedAt: req.body.startedAt ?? null

        };

        await fs.writeJson(
            STATUS_FILE,
            status,
            { spaces: 4 }
        );

        return res.json({
            success: true
        });

    } catch (e) {

        return res.status(500).json({

            success: false,
            message: e.message

        });

    }

});

router.post("/dashboard/renderer", async (req, res) => {

    try {

        const status = await loadStatus();

        status.renderer = {

            online: true,
            lastSeen: new Date().toISOString()

        };

        await fs.writeJson(
            STATUS_FILE,
            status,
            { spaces: 4 }
        );

        return res.json({
            success: true
        });

    } catch (e) {

        return res.status(500).json({

            success: false,
            message: e.message

        });

    }

});

module.exports = router;