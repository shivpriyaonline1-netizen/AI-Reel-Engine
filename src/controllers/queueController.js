const renderService = require("../services/renderService");

const axios = require("axios");

exports.list = async (req, res) => {

    try {

        // Renderer busy hai
        if (renderService.get()) {
            return res.json([]);
        }

        const response = await axios.get(
            "https://shivpriyaonline.com/wp-json/arg/v1/render/next"
        );

        if (
            !response.data ||
            !response.data.success ||
            !response.data.job
        ) {
            return res.json([]);
        }

        renderService.start(response.data.job);

        console.log("======================================");
        console.log("[WP -> ENGINE] JOB RECEIVED");
        console.log("Job ID   :", response.data.job.id);
        console.log("Post ID  :", response.data.job.post_id);
        console.log("Status   :", response.data.job.status);
        console.log("Time     :", new Date().toISOString());
        console.log("======================================");

        return res.json([response.data.job]);

    } catch (err) {

        console.log("========== QUEUE ERROR ==========");
        console.log(err.message);

        return res.json([]);

    }

};

exports.complete = async (req, res) => {

    try {

        const id = req.params.id;

        const body = req.body || {};

const postId = Number(body.post_id || 0);

        console.log("======================================");
console.log("[RENDERER -> ENGINE] COMPLETE RECEIVED");
console.log("Job ID   :", id);
console.log("Time     :", new Date().toISOString());
console.log("======================================");

console.log("======================================");
console.log("[ENGINE -> WORDPRESS] COMPLETE REQUEST");
console.log("Job ID   :", id);
console.log("URL      :", `https://shivpriyaonline.com/wp-json/arg/v1/queue/complete/${id}`);
console.log("Time     :", new Date().toISOString());
console.log("======================================");

        await axios.post(
    `https://shivpriyaonline.com/wp-json/arg/v1/queue/complete/${id}`,
    {
        post_id: postId
    }
);

renderService.clear();

        console.log("======================================");
console.log("[WORDPRESS RESPONSE]");
console.log("Job ID   :", id);
console.log("Status   : COMPLETE ACCEPTED");
console.log("Time     :", new Date().toISOString());
console.log("======================================");

        res.json({
            success: true
        });

    } catch (err) {

        console.error("Complete Error:", err.message);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.fail = async (req, res) => {

    try {

        const id = req.params.id;

        await axios.post(
            `https://shivpriyaonline.com/wp-json/arg/v1/queue/fail/${id}`
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error("Fail Error:", err.message);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const retryWorker = require("../services/retryWorker");

exports.retry = (req, res) => {

    const result = retryWorker.start(

        req.params.id

    );

    res.json(result);

};

exports.stats = async () => {

    try {

        const response = await axios.get(
            "https://shivpriyaonline.com/wp-json/arg/v1/render/stats"
        );

        if (
            response.data &&
            response.data.success
        ) {
            return response.data.stats;
        }

    } catch (err) {

        console.error("Stats Error:", err.message);

    }

    return {
        waiting: 0,
        processing: 0,
        completed: 0,
        failed: 0
    };

};