let currentJob = null;

exports.start = async (data) => {

    currentJob = data;

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

    currentJob = null;

};