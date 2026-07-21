exports.start = async (data) => {

    return {
        success: true,
        job: data.id,
        message: "Job Queued Successfully"
    };

};