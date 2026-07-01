const fs = require("fs");
const path = require("path");

exports.get = (req, res) => {

    const id = req.params.id;

    const file = path.join(
        process.cwd(),
        "output",
        id,
        "content.json"
    );

    if (!fs.existsSync(file)) {

        return res.status(404).json({
            success: false,
            message: "Content Not Found"
        });

    }

    const content = JSON.parse(
        fs.readFileSync(file, "utf8")
    );

    res.json(content);

};