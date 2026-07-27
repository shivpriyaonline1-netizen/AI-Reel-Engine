const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const config = require("../config/config");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../public/videos");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, uploadDir);
    },

    filename(req, file, cb) {

        cb(null, `${req.body.queue_id}.mp4`);

    }

});

const upload = multer({ storage });

router.get("/upload-video", (req, res) => {

    return res.json({
        success: true,
        message: "Upload Route Working"
    });

});

router.post("/upload-video", upload.single("video"), async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No video received"
            });

        }

        const form = new FormData();

        form.append("queue_id", req.body.queue_id);
        form.append("post_id", req.body.post_id);

        form.append(
            "video",
            fs.createReadStream(req.file.path),
            req.file.filename
        );

        const response = await axios.post(

            config.wp.upload,

            form,

            {

                headers: {

                    ...form.getHeaders(),

                    "X-ARG-Key": config.wp.apiKey

                },

                maxBodyLength: Infinity,
                maxContentLength: Infinity

            }

        );

        return res.json(response.data);

    } catch (error) {

    console.error("[UPLOAD ERROR]");

    if (error.response) {
        console.error(error.response.data);
    } else {
        console.error(error.message);
    }

    return res.status(500).json({

        success: false,
        message: error.response
            ? JSON.stringify(error.response.data)
            : error.message

    });

}

});

module.exports = router;