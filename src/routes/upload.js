const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const config = require("../config/config");

console.log("✅ Upload Route Loaded");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../public/videos");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, uploadDir);
    },

    filename(req, file, cb) {
        cb(null, `${req.body.jobId}.mp4`);
    }

});

const upload = multer({ storage });

router.get("/upload-video", (req, res) => {

    res.json({
        success: true,
        message: "Upload Route Working"
    });

});

router.post("/upload-video", upload.single("video"), async (req, res) => {

    try {

        console.log("====================================");
        console.log("[UPLOAD]");
        console.log("Job ID :", req.body.jobId);
        console.log("====================================");

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No video received"
            });

        }

        const form = new FormData();

        form.append("post_id", req.body.jobId);

        form.append(
            "video",
            fs.createReadStream(req.file.path),
            req.file.filename
        );

        const wp = await axios.post(

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

        console.log("✅ WordPress Upload Complete");

        return res.json(wp.data);

    } catch (error) {

        console.error("[UPLOAD ERROR]");

        if (error.response) {

            console.error(error.response.data);

        } else {

            console.error(error.message);

        }

        return res.status(500).json({

            success: false,
            message: "Upload Failed"

        });

    }

});

module.exports = router;