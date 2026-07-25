const axios = require("axios");
const config = require("../config/config");

class WPService {

    async nextJob() {

        try {

            const { data } = await axios.get(
                `${config.wp.api}/render/next`
            );

            return data;

        } catch (error) {

            if (error.response && error.response.status === 404) {
                return null;
            }

            console.error(
                "[WP]",
                error.response?.status || "",
                error.response?.data || error.message
            );

            return null;
        }

    }

}

module.exports = new WPService();