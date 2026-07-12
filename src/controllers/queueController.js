const fs = require("fs");
const path = require("path");
let lastRendererContact = null;

exports.list = (req, res) => {

    lastRendererContact = Date.now();
    console.log("Renderer Connected :", new Date().toLocaleTimeString());

    const dir = path.join(
        process.cwd(),
        "queue",
        "pending"
    );

    const jobs = [];

    if (fs.existsSync(dir)) {

        fs.readdirSync(dir).forEach(file => {

            const job = JSON.parse(
                fs.readFileSync(
                    path.join(dir, file),
                    "utf8"
                )
            );

            jobs.push(job);

        });

    }

    jobs.sort((a, b) =>
        new Date(a.created_at) - new Date(b.created_at)
    );

    res.json(jobs);

};

exports.start = (req, res) => {

    const id = req.params.id;

    const pending = path.join(
        process.cwd(),
        "queue",
        "pending",
        `${id}.json`
    );

    const processingDir = path.join(
        process.cwd(),
        "queue",
        "processing"
    );

    if (!fs.existsSync(processingDir)) {

        fs.mkdirSync(processingDir, {
            recursive: true
        });

    }

    const processing = path.join(
        processingDir,
        `${id}.json`
    );

    if (!fs.existsSync(pending)) {

        return res.status(404).json({
            success: false,
            message: "Job not found"
        });

    }

    fs.renameSync(
        pending,
        processing
    );

    res.json({
        success: true
    });

};

exports.complete = (req, res) => {

    const id = req.params.id;

    const processing = path.join(
        process.cwd(),
        "queue",
        "processing",
        `${id}.json`
    );

    const completedDir = path.join(
        process.cwd(),
        "queue",
        "completed"
    );

    if (!fs.existsSync(completedDir)) {

        fs.mkdirSync(completedDir, {
            recursive: true
        });

    }

    const completed = path.join(
        completedDir,
        `${id}.json`
    );

    if (!fs.existsSync(processing)) {

        return res.status(404).json({
            success: false,
            message: "Job not found"
        });

    }

    fs.renameSync(
        processing,
        completed
    );

    res.json({
        success: true
    });

};

exports.fail = (req, res) => {

    const id = req.params.id;

    const processing = path.join(
        process.cwd(),
        "queue",
        "processing",
        `${id}.json`
    );

    const failedDir = path.join(
        process.cwd(),
        "queue",
        "failed"
    );

    if (!fs.existsSync(failedDir)) {

        fs.mkdirSync(failedDir, {
            recursive: true
        });

    }

    const failed = path.join(
        failedDir,
        `${id}.json`
    );

    if (!fs.existsSync(processing)) {

        return res.status(404).json({
            success: false,
            message: "Job not found"
        });

    }

    fs.renameSync(
        processing,
        failed
    );

    res.json({
        success: true
    });

};

const retryWorker = require("../services/retryWorker");

exports.retry = (req, res) => {

    const result = retryWorker.start(

        req.params.id

    );

    res.json(result);

};

exports.getLastRendererContact = () => {
    return lastRendererContact;
};

exports.stats = () => {

    const count = (folder) => {

        const dir = path.join(
            process.cwd(),
            "queue",
            folder
        );

        if (!fs.existsSync(dir)) {
            return 0;
        }

        return fs.readdirSync(dir)
            .filter(file => file.endsWith(".json"))
            .length;

    };

    return {

        pending: count("pending"),
        processing: count("processing"),
        completed: count("completed"),
        failed: count("failed")

    };

};