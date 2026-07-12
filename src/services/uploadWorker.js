const axios = require("axios");

const WP = "https://shivpriyaonline.com/wp-json/arg/v1";

exports.test = async (job) => {

    try {

        const response = await axios.post(
            `${WP}/upload`,
            {
                post_id: job.id,
                platforms: [
                    "facebook",
                    "instagram",
                    "youtube"
                ]
            }
        );

        console.log("Upload API Response:");

        console.log(response.data);

        return response.data;

    } catch (err) {

        console.log("Upload Error:");

        console.log(err.response?.data || err.message);

        throw err;

    }

};