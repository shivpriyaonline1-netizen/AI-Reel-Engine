const fs = require("fs");
const path = require("path");

exports.list = (req, res) => {

    const dir = path.join(process.cwd(), "queue");

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

    res.json(jobs);

};