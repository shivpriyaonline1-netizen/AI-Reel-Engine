let currentJob = null;

exports.start = async (data) => {

    console.log("======================================");
    console.log("[ENGINE] RAM SET");
    console.log("Job ID   :", data.id);
    console.log("Post ID  :", data.post_id);
    console.log("Time     :", new Date().toISOString());
     console.log("========== RENDER SERVICE ==========");
    console.log("Source : renderService.start()");
    console.log("Job ID :", data.id);
    console.log("Time   :", new Date().toISOString());
    console.trace("Called From");
    console.log("====================================");


    currentJob = data;

    console.log("RAM Job  :", currentJob ? currentJob.id : "NULL");
    console.log("======================================");

    return {
        success: true,
        job: data.id,
        message: "Job Queued Successfully"
    };

};

exports.get = () => {

    return currentJob;

};

exports.clear = () => {

    console.log("======================================");
    console.log("[ENGINE] RAM CLEAR");
    console.log("Before :", currentJob ? currentJob.id : "NULL");

    currentJob = null;

    console.log("After  :", currentJob === null ? "CLEARED" : "NOT CLEARED");
    console.log("Time   :", new Date().toISOString());
    console.log("======================================");

};