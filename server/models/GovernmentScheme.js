const mongoose = require("mongoose");

const governmentSchemeSchema = new mongoose.Schema(
    {
        state: {
            type: String,
            required: true
        },

        schemeName: {
            type: String,
            required: true
        },

        subsidyAmount: {
            type: Number,
            required: true
        },

        maxCapacity: {
            type: Number,
            required: true
        },

        documents: [
            {
                type: String
            }
        ],

        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "GovernmentScheme",
    governmentSchemeSchema
);
