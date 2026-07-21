const renderService = require("../services/renderService");

exports.get = (req, res) => {

    const id = Number(req.params.id);

    const content = renderService.get();

    if (!content || Number(content.id) !== id) {

        return res.status(404).json({
            success: false,
            message: "Content Not Found"
        });

    }

    res.json(content);

};