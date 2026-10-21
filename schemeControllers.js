const GovernmentScheme = require("../models/GovernmentScheme");

// Get Government Scheme by State
const getScheme = async (req, res) => {
    try {

        const { state } = req.params;

        const scheme = await GovernmentScheme.findOne({
            state: {
                $regex: new RegExp(`^${state}$`, "i")
            }
        });

        if (!scheme) {
            return res.status(404).json({
                message: "No Scheme Found"
            });
        }

        res.status(200).json({
            message: "Government Scheme Found",
            scheme
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

module.exports = {
    getScheme
};
