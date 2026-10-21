const mongoose = require("mongoose");

const SolarCalculationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // Set to false to allow calculations without logging in
    },
    monthlyBill: {
      type: Number,
      required: true
    },
    roofArea: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    electricityTariff: {
      type: Number,
      required: true
    },
    monthlyUnits: {
      type: Number
    },
    recommendedCapacity: {
      type: Number
    },
    numberOfPanels: {
      type: Number
    },
    roofRequired: {
      type: Number
    },
    installationCost: {
      type: Number
    },
    subsidy: {
      type: Number
    },
    finalCost: {
      type: Number
    },
    monthlySavings: {
      type: Number
    },
    annualSavings: {
      type: Number
    },
    paybackPeriod: {
      type: Number
    },
    co2Reduction: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SolarCalculation", SolarCalculationSchema);