const express = require("express");

console.log("✅ Upload Route Loaded");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const axios = require("axios");
const FormData = require("form-data");

const WP = "https://shivpriyaonline.com/wp-json/arg/v1/upload";

const router = express.Router();

const uploadDir = path.join(

    __dirname,

    "../../public/videos"

);

if (!fs.existsSync(uploadDir)) {

    fs.mkdirSync(uploadDir, {

        recursive: true

    });

}

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(

            null,

            uploadDir

        );

    },

    filename(req, file, cb) {

        const jobId = req.body.jobId;

        cb(

            null,

            `${jobId}.mp4`

        );

    }

});

const upload = multer({

    storage

});

router.get("/upload-video", (req, res) => {

    res.json({

        success: true,

        message: "Upload Route Working"

    });

});

router.post(

    "/upload-video",

    upload.single("video"),

    async (req, res) => {

        console.log("📤 Upload Request");

console.log(req.body);

console.log(req.file);

if (!req.file) return res.status(400).json({ success: false, error: "No file received by Engine" });

const form = new FormData();

form.append("post_id", req.body.jobId);

form.append(
    "video",
    fs.createReadStream(req.file.path),
    req.file.filename
);

console.log("Forwarding File :", req.file.path);

const wp = await axios.post(

    WP,

    form,

    {

        headers: form.getHeaders(),

        maxBodyLength: Infinity,

        maxContentLength: Infinity

    }

);

console.log("✅ WordPress Upload Complete");

console.log(wp.data);

return res.json(wp.data);

    }

);

module.exports = router;