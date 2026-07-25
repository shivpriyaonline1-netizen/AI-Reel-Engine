const queueService = require("./queueService");

exports.get = async () => {

    return await queueService.nextJob();

};

exports.complete = async (queueId) => {

    return await queueService.completeJob(queueId);

};

exports.fail = async (queueId) => {

    return await queueService.failJob(queueId);

};

exports.clear = async () => {

    return true;

};