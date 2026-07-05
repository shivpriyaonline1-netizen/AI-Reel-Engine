const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

router.post(

    "/upload-video",

    upload.single("video"),

    (req, res) => {

        res.json({

            success: true,

            url:
`https://khaki-woodpecker-407380.hostingersite.com/videos/${req.body.jobId}.mp4`

        });

    }

);

module.exports = router;