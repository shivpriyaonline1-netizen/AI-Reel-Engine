const fs = require("fs");
const path = require("path");

exports.list = (req, res) => {

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

    // FIFO (oldest first)
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

    const processing = path.join(

        process.cwd(),

        "queue",

        "processing",

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