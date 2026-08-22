const calculateSolarLogic = require("../utils/solarCalculator");
const { getSolarSchemeAdvice } = require("../utils/aiAdvisor");

let SolarCalculation;
try {
  SolarCalculation = require("../models/SolarCalculation");
} catch (e) {
  SolarCalculation = null;
}

const calculateSolar = async (req, res) => {
  try {
    const { monthlyBill, roofArea, location, electricityTariff } = req.body;

    if (!monthlyBill || !roofArea || !location || !electricityTariff) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // 1. Math calculations
    const result = calculateSolarLogic(monthlyBill, roofArea, electricityTariff);
    const {
      monthlyUnits,
      recommendedCapacity,
      panelsRequired,
      roofRequired,
      installationCost,
      subsidy,
      finalCost,
      monthlySavings,
      yearlySavings,
      paybackPeriod,
    } = result;

    const co2Reduction = (recommendedCapacity * 1.2).toFixed(2);

    // 2. Fetch AI Recommendations from Gemini
    const aiAdvice = await getSolarSchemeAdvice({
      location,
      recommendedCapacity,
      monthlyBill,
      subsidy
    });

    const calculationData = {
      monthlyBill,
      roofArea,
      location,
      electricityTariff,
      monthlyUnits,
      recommendedCapacity,
      numberOfPanels: panelsRequired,
      roofRequired,
      installationCost,
      subsidy,
      finalCost,
      monthlySavings,
      annualSavings: yearlySavings,
      paybackPeriod,
      co2Reduction,
      aiAdvice // Attach AI output
    };

    if (SolarCalculation) {
      SolarCalculation.create({
        ...calculationData,
        user: req.user ? req.user.id : null,
      }).catch((dbErr) => console.log("DB save skipped:", dbErr.message));
    }

    return res.status(200).json({
      message: "Solar Calculation Generated Successfully",
      calculation: calculationData,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

module.exports = {
  calculateSolar,
  getCalculationHistory: async (req, res) => res.json({ calculations: [] }),
  deleteCalculation: async (req, res) => res.json({ message: "Deleted" }),
};
