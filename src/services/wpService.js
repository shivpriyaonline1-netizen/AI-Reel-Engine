const axios = require("axios");
const config = require("../config/config");

class WPService {

    async nextJob() {

        try {

            const response = await axios.get(
                `${config.wp.api}/render/next`
            );

            return response.data;

        } catch (error) {

            if (error.response) {

                console.error("[WP]", error.response.status, error.response.data);

            } else {

                console.error("[WP]", error.message);

            }

            return null;

        }

    }

}

module.exports = new WPService();