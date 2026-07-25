const queueService = require("./services/queueService");
const renderer = require("./renderer"); // tumhara renderer module

let busy = false;

async function work() {

    if (busy) {
        return;
    }

    busy = true;

    try {

        const job = await queueService.nextJob();

        if (!job) {
            busy = false;
            return;
        }

        console.log("====================================");
        console.log("[WORKER]");
        console.log("Queue ID :", job.queue_id);
        console.log("Post ID  :", job.post_id);
        console.log("====================================");

        const result = await renderer.render(job);

        if (result && result.success) {

            await queueService.completeJob(job.queue_id);

        } else {

            await queueService.failJob(job.queue_id);

        }

    } catch (err) {

        console.error("[WORKER]", err);

    } finally {

        busy = false;

    }

}

exports.start = () => {

    console.log("[WORKER] Started");

    work();

    setInterval(work, 3000);

};