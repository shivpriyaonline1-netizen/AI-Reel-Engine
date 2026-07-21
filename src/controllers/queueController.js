const fs = require("fs");
const path = require("path");

const cleanupService = require("../services/cleanupService");

console.log("cleanupService =", cleanupService);

const axios = require("axios");

const STATUS_FILE = path.join(
    process.cwd(),
    "storage",
    "status.json"
);
let lastRendererContact = null;

exports.list = async (req, res) => {

    try {

        const response = await axios.get(
            "https://shivpriyaonline.com/wp-json/arg/v1/render/next"
        );

        if (
            !response.data ||
            !response.data.success
        ) {
            return res.json([]);
        }

        console.log("======================================");
console.log("[WP -> ENGINE] JOB RECEIVED");

if (response.data.job) {
    console.log("Job ID   :", response.data.job.id);
    console.log("Post ID  :", response.data.job.post_id);
    console.log("Status   :", response.data.job.status);
} else {
    console.log("No Job Returned");
}

console.log("Time     :", new Date().toISOString());
console.log("======================================");

        console.log("======================================");
console.log("[ENGINE -> RENDERER] JOB SENT");
console.log("Job ID   :", response.data.job.id);
console.log("Post ID  :", response.data.job.post_id);
console.log("Status   :", response.data.job.status);
console.log("Time     :", new Date().toISOString());
console.log("======================================");

return res.json([response.data.job]);

    } catch (err) {

    console.log("========== QUEUE ERROR ==========");
    console.log("Message :", err.message);
    console.log("Status  :", err.response?.status);
    console.log("URL     :", err.config?.url);
    console.log("Method  :", err.config?.method);
    console.log("Body    :", err.response?.data);
    console.log("=================================");

    return res.json([]);

}

};

exports.start = async (req, res) => {

    try {

        const id = req.params.id;

        await axios.post(
            `https://shivpriyaonline.com/wp-json/arg/v1/queue/start/${id}`
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error("Start Error:", err.message);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.complete = async (req, res) => {

    try {

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
            `https://shivpriyaonline.com/wp-json/arg/v1/queue/complete/${id}`
        );

        console.log("======================================");
console.log("[WORDPRESS RESPONSE]");
console.log("Job ID   :", id);
console.log("Status   : COMPLETE ACCEPTED");
console.log("Time     :", new Date().toISOString());
console.log("======================================");

if (postId > 0) {
    cleanupService.remove(postId);
}

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

exports.getLastRendererContact = () => {
    return lastRendererContact;
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