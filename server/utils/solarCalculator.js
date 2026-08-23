```javascript
/**
 * SolarSense AI
 * Solar calculation utility
 *
 * This file is intentionally kept compatible with the existing
 * solarControllers.js file.
 *
 * Existing controller calls:
 * calculateSolarLogic(monthlyBill, roofArea, electricityTariff)
 *
 * Existing controller expects:
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
 */

// ---------------------------------------------------------
// SYSTEM CONSTANTS
// ---------------------------------------------------------

// Standard residential solar panel used for the calculation
const PANEL_WATTAGE_KW = 0.55; // 550 W = 0.55 kW

// Approximate area required by one 550 W panel
const PANEL_AREA_SQFT = 22;

// Average useful solar generation.
// 1 kW solar system produces approximately 120 units/month.
const MONTHLY_GENERATION_PER_KW = 120;

// Approximate installation cost per kW
const INSTALLATION_COST_PER_KW = 60000;

// PM Surya Ghar style central subsidy calculation
const SUBSIDY_FIRST_2KW_PER_KW = 30000;
const SUBSIDY_NEXT_1KW_PER_KW = 18000;
const MAX_CENTRAL_SUBSIDY = 78000;

// Estimated percentage of electricity bill offset by solar.
// We do not assume 100% because generation varies with weather,
// shading, system losses, grid conditions, etc.
const BILL_OFFSET_FACTOR = 0.90;

// ---------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------

const round = (value, decimals = 2) => {
    const multiplier = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
};

const validateNumber = (value, fieldName) => {
    const number = Number(value);

    if (!Number.isFinite(number) || number <= 0) {
        throw new Error(`${fieldName} must be a valid number greater than 0`);
    }

    return number;
};

// ---------------------------------------------------------
// SUBSIDY CALCULATION
// ---------------------------------------------------------

const calculateSubsidy = (capacityKW) => {
    let subsidy = 0;

    // First 2 kW
    const firstSlab = Math.min(capacityKW, 2);

    subsidy += firstSlab * SUBSIDY_FIRST_2KW_PER_KW;

    // Next 1 kW
    if (capacityKW > 2) {
        const nextSlab = Math.min(capacityKW - 2, 1);

        subsidy += nextSlab * SUBSIDY_NEXT_1KW_PER_KW;
    }

    // Maximum central subsidy
    subsidy = Math.min(subsidy, MAX_CENTRAL_SUBSIDY);

    return Math.round(subsidy);
};

// ---------------------------------------------------------
// MAIN SOLAR CALCULATION
// ---------------------------------------------------------

const calculateSolar = (monthlyBill, roofArea, tariff) => {

    // -----------------------------------------------------
    // 1. Validate input
    // -----------------------------------------------------

    monthlyBill = validateNumber(monthlyBill, "Monthly bill");
    roofArea = validateNumber(roofArea, "Roof area");
    tariff = validateNumber(tariff, "Electricity tariff");

    // -----------------------------------------------------
    // 2. Calculate monthly electricity consumption
    // -----------------------------------------------------
    //
    // Example:
    //
    // Bill = ₹3000
    // Tariff = ₹10/unit
    //
    // Units = 3000 / 10 = 300 units/month
    //
    // -----------------------------------------------------

    const monthlyUnits = round(monthlyBill / tariff, 2);

    // -----------------------------------------------------
    // 3. Calculate solar capacity required
    // -----------------------------------------------------
    //
    // If 1 kW produces approximately 120 units/month:
    //
    // Required capacity =
    // monthly consumption / generation per kW
    //
    // Example:
    // 300 / 120 = 2.5 kW
    //
    // -----------------------------------------------------

    let requiredCapacity = monthlyUnits / MONTHLY_GENERATION_PER_KW;

    // -----------------------------------------------------
    // 4. Calculate number of panels
    // -----------------------------------------------------
    //
    // A panel = 550 W = 0.55 kW
    //
    // Example:
    // 2.5 / 0.55 = 4.54
    //
    // We cannot install 4.54 panels, so:
    // ceil(4.54) = 5 panels
    //
    // -----------------------------------------------------

    const panelsRequired = Math.ceil(
        requiredCapacity / PANEL_WATTAGE_KW
    );

    // -----------------------------------------------------
    // 5. Calculate actual system capacity
    // -----------------------------------------------------
    //
    // Since panels are whole units, the actual installed
    // capacity may be slightly higher than the theoretical
    // requirement.
    //
    // Example:
    // 5 × 0.55 = 2.75 kW
    //
    // -----------------------------------------------------

    let recommendedCapacity = panelsRequired * PANEL_WATTAGE_KW;

    recommendedCapacity = round(recommendedCapacity, 2);

    // -----------------------------------------------------
    // 6. Calculate roof area required
    // -----------------------------------------------------

    const roofRequired = panelsRequired * PANEL_AREA_SQFT;

    // -----------------------------------------------------
    // 7. Check whether the roof can accommodate the system
    // -----------------------------------------------------

    const roofFeasible = roofArea >= roofRequired;

    // -----------------------------------------------------
    // 8. Calculate expected monthly solar generation
    // -----------------------------------------------------

    const estimatedMonthlyGeneration = round(
        recommendedCapacity * MONTHLY_GENERATION_PER_KW,
        2
    );

    // -----------------------------------------------------
    // 9. Calculate yearly solar generation
    // -----------------------------------------------------

    const estimatedYearlyGeneration = round(
        estimatedMonthlyGeneration * 12,
        2
    );

    // -----------------------------------------------------
    // 10. Calculate installation cost
    // -----------------------------------------------------

    const installationCost = Math.round(
        recommendedCapacity * INSTALLATION_COST_PER_KW
    );

    // -----------------------------------------------------
    // 11. Calculate government subsidy
    // -----------------------------------------------------

    const subsidy = calculateSubsidy(recommendedCapacity);

    // -----------------------------------------------------
    // 12. Calculate final cost after subsidy
    // -----------------------------------------------------

    const finalCost = Math.max(
        0,
        installationCost - subsidy
    );

    // -----------------------------------------------------
    // 13. Calculate estimated savings
    // -----------------------------------------------------
    //
    // We use the existing project's assumption that solar
    // can offset approximately 90% of the current electricity
    // bill.
    //
    // This keeps the result conservative instead of assuming
    // the electricity bill becomes exactly zero.
    //
    // -----------------------------------------------------

    const monthlySavings = round(
        monthlyBill * BILL_OFFSET_FACTOR,
        2
    );

    const yearlySavings = round(
        monthlySavings * 12,
        2
    );

    // -----------------------------------------------------
    // 14. Calculate payback period
    // -----------------------------------------------------
    //
    // Payback =
    // Net installation cost / yearly savings
    //
    // Result is in years.
    //
    // -----------------------------------------------------

    let paybackPeriod = 0;

    if (yearlySavings > 0) {
        paybackPeriod = round(
            finalCost / yearlySavings,
            1
        );
    }

    // -----------------------------------------------------
    // 15. Return result
    // -----------------------------------------------------
    //
    // IMPORTANT:
    // These property names MUST remain compatible with
    // solarControllers.js.
    //
    // -----------------------------------------------------

    return {

        // Existing fields
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

        // Additional useful calculation fields
        // These do not break the existing controller.

        roofArea: round(roofArea, 2),

        roofFeasible,

        availableRoofArea: round(roofArea, 2),

        estimatedMonthlyGeneration,

        estimatedYearlyGeneration,

        panelWattage: PANEL_WATTAGE_KW * 1000,

        generationPerKWPerMonth: MONTHLY_GENERATION_PER_KW,

        billOffsetPercentage: BILL_OFFSET_FACTOR * 100
    };
};

// ---------------------------------------------------------
// EXPORT
// ---------------------------------------------------------

module.exports = calculateSolar;
```
