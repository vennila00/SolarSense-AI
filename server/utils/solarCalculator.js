```javascript
/**
 * SolarSense AI
 * ---------------------------------------------------------
 * Solar Calculation Engine
 *
 * IMPORTANT:
 * This file is designed to work with the EXISTING controller.
 *
 * Existing controller call:
 *
 * calculateSolarLogic(
 *     monthlyBill,
 *     roofArea,
 *     electricityTariff
 * )
 *
 * Existing fields are preserved:
 *
 * monthlyUnits
 * recommendedCapacity
 * panelsRequired
 * roofRequired
 * installationCost
 * subsidy
 * finalCost
 * monthlySavings
 * yearlySavings
 * paybackPeriod
 *
 * Additional fields are also returned for the frontend.
 * ---------------------------------------------------------
 */


// =========================================================
// 1. SYSTEM CONSTANTS
// =========================================================

// Solar panel size
// 550 W = 0.55 kW
const PANEL_WATTAGE_KW = 0.55;

// Approximate roof area needed for one panel.
// Includes spacing / mounting allowance.
const PANEL_AREA_SQFT = 22;

// Average estimated monthly generation per kW.
//
// This is a simplified planning assumption.
// Actual generation depends on location, irradiation,
// orientation, shading, temperature, system losses, etc.
const BASE_MONTHLY_GENERATION_PER_KW = 120;

// Approximate installation cost.
//
// This is a planning estimate, NOT a vendor quotation.
const INSTALLATION_COST_PER_KW = 60000;


// =========================================================
// 2. PM SURYA GHAR CENTRAL SUBSIDY
// =========================================================
//
// Official residential CFA structure:
//
// First 2 kW:
// ₹30,000 per kW
//
// Additional 1 kW:
// ₹18,000 per kW
//
// Above 3 kW:
// No additional central CFA
//
// Maximum:
// ₹78,000
//
// =========================================================

const SUBSIDY_FIRST_2KW_PER_KW = 30000;
const SUBSIDY_NEXT_1KW_PER_KW = 18000;
const MAX_CENTRAL_SUBSIDY = 78000;


// =========================================================
// 3. SOLAR GENERATION FACTORS
// =========================================================
//
// These are planning factors, not official subsidy values.
//
// India has different solar resource levels depending on
// location. We use broad regional factors so the calculator
// can produce a more useful estimate without requiring an
// external solar API.
//
// The factor multiplies the base 120 units/kW/month.
//
// Example:
//
// Mumbai factor = 1.00
// 1 kW ≈ 120 units/month
//
// Higher factor → slightly higher generation estimate.
// Lower factor → slightly lower generation estimate.
//
// =========================================================

const LOCATION_GENERATION_FACTORS = [

    {
        keywords: [
            "rajasthan",
            "jaipur",
            "jodhpur",
            "udaipur",
            "bikaner",
            "ajmer"
        ],
        factor: 1.10
    },

    {
        keywords: [
            "gujarat",
            "ahmedabad",
            "surat",
            "vadodara",
            "rajkot"
        ],
        factor: 1.08
    },

    {
        keywords: [
            "maharashtra",
            "mumbai",
            "pune",
            "nagpur",
            "nashik",
            "aurangabad"
        ],
        factor: 1.00
    },

    {
        keywords: [
            "madhya pradesh",
            "bhopal",
            "indore",
            "gwalior"
        ],
        factor: 1.05
    },

    {
        keywords: [
            "delhi",
            "new delhi",
            "haryana",
            "gurgaon",
            "gurugram",
            "faridabad"
        ],
        factor: 1.00
    },

    {
        keywords: [
            "punjab",
            "chandigarh",
            "amritsar",
            "ludhiana"
        ],
        factor: 0.98
    },

    {
        keywords: [
            "uttar pradesh",
            "lucknow",
            "kanpur",
            "noida",
            "varanasi"
        ],
        factor: 0.98
    },

    {
        keywords: [
            "bihar",
            "patna",
            "gaya"
        ],
        factor: 0.95
    },

    {
        keywords: [
            "west bengal",
            "kolkata"
        ],
        factor: 0.92
    },

    {
        keywords: [
            "odisha",
            "bhubaneswar",
            "cuttack"
        ],
        factor: 0.95
    },

    {
        keywords: [
            "jharkhand",
            "ranchi"
        ],
        factor: 0.94
    },

    {
        keywords: [
            "chhattisgarh",
            "raipur"
        ],
        factor: 0.98
    },

    {
        keywords: [
            "karnataka",
            "bangalore",
            "bengaluru",
            "mysore",
            "mysuru"
        ],
        factor: 1.00
    },

    {
        keywords: [
            "telangana",
            "hyderabad"
        ],
        factor: 1.03
    },

    {
        keywords: [
            "andhra pradesh",
            "vijayawada",
            "visakhapatnam",
            "vizag"
        ],
        factor: 1.03
    },

    {
        keywords: [
            "tamil nadu",
            "chennai",
            "coimbatore",
            "madurai"
        ],
        factor: 1.03
    },

    {
        keywords: [
            "kerala",
            "kochi",
            "trivandrum",
            "thiruvananthapuram"
        ],
        factor: 0.90
    },

    {
        keywords: [
            "goa",
            "panaji"
        ],
        factor: 0.95
    },

    {
        keywords: [
            "assam",
            "guwahati"
        ],
        factor: 0.88
    },

    {
        keywords: [
            "north east",
            "meghalaya",
            "tripura",
            "manipur",
            "nagaland",
            "mizoram",
            "arunachal"
        ],
        factor: 0.85
    }
];


// =========================================================
// 4. GENERAL HELPERS
// =========================================================

const round = (value, decimals = 2) => {

    const multiplier = Math.pow(10, decimals);

    return Math.round(
        (value + Number.EPSILON) * multiplier
    ) / multiplier;
};


const validateNumber = (value, fieldName) => {

    const number = Number(value);

    if (
        !Number.isFinite(number) ||
        number <= 0
    ) {
        throw new Error(
            `${fieldName} must be a valid number greater than 0`
        );
    }

    return number;
};


// =========================================================
// 5. LOCATION FACTOR
// =========================================================

const getLocationFactor = (location) => {

    if (!location) {
        return 1.0;
    }

    const normalizedLocation =
        String(location)
            .toLowerCase()
            .trim();


    for (const region of LOCATION_GENERATION_FACTORS) {

        for (const keyword of region.keywords) {

            if (normalizedLocation.includes(keyword)) {

                return region.factor;
            }
        }
    }

    // If location is unknown,
    // use a neutral factor.
    return 1.0;
};


// =========================================================
// 6. SUBSIDY CALCULATION
// =========================================================

const calculateCentralSubsidy = (capacityKW) => {

    let subsidy = 0;


    // -----------------------------------------------------
    // First 2 kW
    // -----------------------------------------------------

    const firstSlab = Math.min(
        capacityKW,
        2
    );

    subsidy +=
        firstSlab *
        SUBSIDY_FIRST_2KW_PER_KW;


    // -----------------------------------------------------
    // Additional capacity between 2 kW and 3 kW
    // -----------------------------------------------------

    if (capacityKW > 2) {

        const secondSlab = Math.min(
            capacityKW - 2,
            1
        );

        subsidy +=
            secondSlab *
            SUBSIDY_NEXT_1KW_PER_KW;
    }


    // -----------------------------------------------------
    // Maximum central subsidy
    // -----------------------------------------------------

    subsidy = Math.min(
        subsidy,
        MAX_CENTRAL_SUBSIDY
    );


    return Math.round(subsidy);
};


// =========================================================
// 7. MAIN SOLAR CALCULATION
// =========================================================

const calculateSolar = (
    monthlyBill,
    roofArea,
    tariff,
    location = ""
) => {


    // =====================================================
    // INPUT VALIDATION
    // =====================================================

    monthlyBill = validateNumber(
        monthlyBill,
        "Monthly bill"
    );

    roofArea = validateNumber(
        roofArea,
        "Roof area"
    );

    tariff = validateNumber(
        tariff,
        "Electricity tariff"
    );


    // =====================================================
    // 1. MONTHLY ELECTRICITY CONSUMPTION
    // =====================================================

    const monthlyUnits = round(
        monthlyBill / tariff,
        2
    );


    // =====================================================
    // 2. LOCATION-BASED SOLAR GENERATION FACTOR
    // =====================================================

    const locationFactor =
        getLocationFactor(location);


    const monthlyGenerationPerKW =
        round(
            BASE_MONTHLY_GENERATION_PER_KW *
            locationFactor,
            2
        );


    // =====================================================
    // 3. REQUIRED SOLAR CAPACITY
    // =====================================================
    //
    // Required capacity =
    //
    // monthly consumption /
    // expected generation per kW
    //
    // =====================================================

    const theoreticalCapacity =
        monthlyUnits /
        monthlyGenerationPerKW;


    // =====================================================
    // 4. NUMBER OF PANELS
    // =====================================================

    const panelsRequired = Math.ceil(
        theoreticalCapacity /
        PANEL_WATTAGE_KW
    );


    // =====================================================
    // 5. ACTUAL INSTALLED CAPACITY
    // =====================================================
    //
    // We calculate this AFTER determining whole panels.
    //
    // This prevents:
    //
    // 2.5 kW system
    //
    // from incorrectly being represented by
    //
    // 4.54 panels.
    //
    // =====================================================

    const recommendedCapacity =
        round(
            panelsRequired *
            PANEL_WATTAGE_KW,
            2
        );


    // =====================================================
    // 6. REQUIRED ROOF AREA
    // =====================================================

    const roofRequired =
        panelsRequired *
        PANEL_AREA_SQFT;


    // =====================================================
    // 7. ROOF FEASIBILITY
    // =====================================================

    const roofFeasible =
        roofArea >= roofRequired;


    const roofAreaDifference =
        round(
            roofArea - roofRequired,
            2
        );


    // =====================================================
    // 8. EXPECTED MONTHLY GENERATION
    // =====================================================

    const estimatedMonthlyGeneration =
        round(
            recommendedCapacity *
            monthlyGenerationPerKW,
            2
        );


    // =====================================================
    // 9. EXPECTED YEARLY GENERATION
    // =====================================================

    const estimatedYearlyGeneration =
        round(
            estimatedMonthlyGeneration *
            12,
            2
        );


    // =====================================================
    // 10. GENERATION COVERAGE
    // =====================================================
    //
    // How much of the user's current consumption
    // could theoretically be generated by the system.
    //
    // =====================================================

    const generationCoverage =
        round(
            (
                estimatedMonthlyGeneration /
                monthlyUnits
            ) * 100,
            1
        );


    // =====================================================
    // 11. INSTALLATION COST
    // =====================================================

    const installationCost =
        Math.round(
            recommendedCapacity *
            INSTALLATION_COST_PER_KW
        );


    // =====================================================
    // 12. CENTRAL GOVERNMENT SUBSIDY
    // =====================================================

    const subsidy =
        calculateCentralSubsidy(
            recommendedCapacity
        );


    // =====================================================
    // 13. NET SYSTEM COST
    // =====================================================

    const finalCost =
        Math.max(
            0,
            installationCost - subsidy
        );


    // =====================================================
    // 14. ESTIMATED MONTHLY SAVINGS
    // =====================================================
    //
    // We use a conservative 90% bill-offset assumption.
    //
    // Actual savings can vary depending on:
    //
    // - self-consumption
    // - net metering
    // - export tariff
    // - generation
    // - electricity tariff slabs
    // - system losses
    //
    // =====================================================

    const BILL_OFFSET_FACTOR = 0.90;


    const monthlySavings =
        round(
            monthlyBill *
            BILL_OFFSET_FACTOR,
            2
        );


    // =====================================================
    // 15. YEARLY SAVINGS
    // =====================================================

    const yearlySavings =
        round(
            monthlySavings * 12,
            2
        );


    // =====================================================
    // 16. PAYBACK PERIOD
    // =====================================================

    let paybackPeriod = 0;


    if (yearlySavings > 0) {

        paybackPeriod =
            round(
                finalCost /
                yearlySavings,
                1
            );
    }


    // =====================================================
    // 17. CO2 REDUCTION
    // =====================================================
    //
    // Approximate annual CO2 reduction.
    //
    // Assumption:
    // 1 kWh solar generation avoids approximately
    // 0.7 kg CO2 equivalent.
    //
    // This is an estimation and can vary by grid factor.
    //
    // =====================================================

    const CO2_FACTOR = 0.7;


    const annualCO2Reduction =
        round(
            estimatedYearlyGeneration *
            CO2_FACTOR /
            1000,
            2
        );


    // =====================================================
    // 18. SUBSIDY INFORMATION
    // =====================================================

    let subsidySlab = "";

    if (recommendedCapacity <= 2) {

        subsidySlab =
            "₹30,000 per kW for the first 2 kW";

    } else if (recommendedCapacity <= 3) {

        subsidySlab =
            "₹30,000/kW for first 2 kW + ₹18,000 for additional capacity up to 3 kW";

    } else {

        subsidySlab =
            "Maximum central subsidy of ₹78,000";
    }


    // =====================================================
    // 19. SYSTEM SIZE CATEGORY
    // =====================================================

    let systemCategory = "";


    if (recommendedCapacity <= 1) {

        systemCategory = "Small residential system";

    } else if (recommendedCapacity <= 2) {

        systemCategory = "Residential system";

    } else if (recommendedCapacity <= 3) {

        systemCategory = "Large residential system";

    } else {

        systemCategory =
            "High-consumption residential system";
    }


    // =====================================================
    // 20. RETURN RESULT
    // =====================================================
    //
    // Existing fields are preserved exactly.
    //
    // Additional fields are included below them.
    //
    // =====================================================

    return {

        // -------------------------------------------------
        // EXISTING API FIELDS
        // -------------------------------------------------

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


        // -------------------------------------------------
        // NEW CALCULATION FIELDS
        // -------------------------------------------------

        roofArea,

        roofFeasible,

        roofAreaDifference,

        panelWattage: PANEL_WATTAGE_KW * 1000,

        panelArea: PANEL_AREA_SQFT,

        theoreticalCapacity:
            round(
                theoreticalCapacity,
                2
            ),

        actualInstalledCapacity:
            recommendedCapacity,

        estimatedMonthlyGeneration,

        estimatedYearlyGeneration,

        monthlyGenerationPerKW,

        generationCoverage,

        locationFactor,

        systemCategory,

        annualCO2Reduction,

        subsidySlab,

        subsidyMaximum:
            MAX_CENTRAL_SUBSIDY,

        centralSubsidyEligible:
            true,

        subsidyScheme:
            "PM Surya Ghar Muft Bijli Yojana",

        assumptions: {

            monthlyGeneration:
                `${monthlyGenerationPerKW} units/kW/month`,

            installationCostPerKW:
                INSTALLATION_COST_PER_KW,

            billOffset:
                "90% estimated bill offset",

            panelWattage:
                "550 W",

            roofAreaPerPanel:
                "22 sq ft",

            co2Factor:
                "0.7 kg CO2/kWh"
        }

    };
};


// =========================================================
// EXPORT
// =========================================================

module.exports = calculateSolar;
```
