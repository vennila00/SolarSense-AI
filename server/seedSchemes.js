console.log("Seed file started...");

require("dotenv").config();

const connectDB = require("./config/db");
const GovernmentScheme = require("./models/GovernmentScheme");

const schemes = [
    {
        state: "Maharashtra",
        schemeName: "PM Surya Ghar Muft Bijli Yojana",
        subsidyAmount: 78000,
        maxCapacity: 3,
        documents: [
            "Aadhaar Card",
            "Electricity Bill",
            "Property Proof",
            "Bank Passbook"
        ],
        description: "Central Government Rooftop Solar Subsidy Scheme"
    },
    {
        state: "Gujarat",
        schemeName: "Surya Gujarat Yojana",
        subsidyAmount: 78000,
        maxCapacity: 3,
        documents: [
            "Aadhaar Card",
            "Electricity Bill",
            "Property Proof"
        ],
        description: "Solar subsidy scheme for Gujarat residents"
    },
    {
        state: "Karnataka",
        schemeName: "PM Surya Ghar Muft Bijli Yojana",
        subsidyAmount: 78000,
        maxCapacity: 3,
        documents: [
            "Aadhaar Card",
            "Electricity Bill",
            "Bank Passbook"
        ],
        description: "Central rooftop solar subsidy"
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        await GovernmentScheme.deleteMany();

        console.log("🗑 Old Schemes Deleted");

        await GovernmentScheme.insertMany(schemes);

        console.log("✅ Government Schemes Added");

        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDatabase();