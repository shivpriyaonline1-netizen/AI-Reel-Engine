const express = require("express");

const router = express.Router();

router.get("/dashboard", (req, res) => {

    res.json({

        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,

        engine: "Running",
        renderers: 1,
        queue: 0,
        heartbeat: "Just Now"

    });

});

module.exports = router;