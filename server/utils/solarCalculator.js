const calculateSolar = (monthlyBill, roofArea, tariff) => {

    // Monthly electricity units consumed
    const monthlyUnits = monthlyBill / tariff;

    // Recommended solar capacity (1 kW ≈ 120 units/month)
    const recommendedCapacity = +(monthlyUnits / 120).toFixed(2);

    // Number of solar panels (550W panels)
    const panelsRequired = Math.ceil(recommendedCapacity / 0.55);

    // Roof area required (22 sq ft per panel)
    const roofRequired = panelsRequired * 22;

    // Installation Cost
    const installationCost = Math.round(recommendedCapacity * 60000);

    // Government Subsidy
    let subsidy = 0;

    if (recommendedCapacity <= 3) {
        subsidy = recommendedCapacity * 26000;
    } else {
        subsidy = 78000;
    }

    // Final Cost
    const finalCost = installationCost - subsidy;

    // Estimated Savings
    const monthlySavings = monthlyBill * 0.90;

    const yearlySavings = monthlySavings * 12;

    // Payback Period
    const paybackPeriod = +(finalCost / yearlySavings).toFixed(1);

    return {

        monthlyUnits,

        recommendedCapacity,

        panelsRequired,

        roofRequired,

        installationCost,

        subsidy,

        finalCost,

        monthlySavings,

        yearlySavings,

        paybackPeriod

    };

};

module.exports = calculateSolar;
