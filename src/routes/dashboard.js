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

    try {

        if (!(await fs.pathExists(STATUS_FILE))) {

            return {
                engine: {
                    status: "Running"
                },
                renderer: {
                    online: false,
                    lastSeen: null
                },
                currentJob: {
                    id: null,
                    title: null,
                    stage: "Idle",
                    progress: 0,
                    startedAt: null
                }
            };

        }

        return await fs.readJson(STATUS_FILE);

    } catch {

        return {
            engine: {
                status: "Running"
            },
            renderer: {
                online: false,
                lastSeen: null
            },
            currentJob: {
                id: null,
                title: null,
                stage: "Idle",
                progress: 0,
                startedAt: null
            }
        };

    }

}

router.get("/dashboard", async (req, res) => {

    const status = await loadStatus();

    const pending = await count(PENDING);
    const processing = await count(PROCESSING);
    const completed = await count(COMPLETED);
    const failed = await count(FAILED);

    res.json({

        pending,
        processing,
        completed,
        failed,

        engine: status.engine.status,

        queue: pending + processing,

        renderers: status.renderer.online ? 1 : 0,

        renderer_status: status.renderer.online ? "Online" : "Offline",

        heartbeat: status.renderer.lastSeen,

        currentJob: status.currentJob

    });

});

router.post("/dashboard/job", async (req, res) => {

    try {

        const status = await loadStatus();

        status.currentJob = {

            id: req.body.id ?? null,
            title: req.body.title ?? null,
            stage: req.body.stage ?? "Idle",
            progress: req.body.progress ?? 0,
            startedAt: req.body.startedAt ?? null

        };

        await fs.writeJson(
            STATUS_FILE,
            status,
            {
                spaces: 4
            }
        );

        res.json({
            success: true
        });

    } catch (e) {

        res.status(500).json({

            success: false,

            message: e.message

        });

    }

});

module.exports = router;