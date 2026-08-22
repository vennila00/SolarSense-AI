const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

async function getSolarSchemeAdvice({ location, recommendedCapacity, monthlyBill, subsidy }) {
  if (!process.env.GEMINI_API_KEY) {
    return {
      schemeName: 'PM Surya Ghar: Muft Bijli Yojana',
      summary: 'Central subsidy applied based on capacity guidelines. Add GEMINI_API_KEY to .env for AI insights.',
      documents: ['Electricity Bill (Last 3 months)', 'Aadhaar Card', 'Roof Ownership Proof / Property Tax Receipt', 'Bank Passbook / Cancelled Cheque'],
      stateTips: `Consult your local DISCOM in ${location} for net-metering approvals.`
    };
  }

  const prompt = `You are a certified Indian Solar Energy Consultant. 
Analyze these rooftop solar parameters:
- State/Location: ${location}
- Recommended System Capacity: ${recommendedCapacity} kW
- Monthly Bill: ₹${monthlyBill}
- Calculated Central Subsidy: ₹${subsidy}

Provide structured JSON advice formatted strictly with these keys:
{
  "schemeName": "Applicable Government Solar Scheme name (e.g. PM Surya Ghar: Muft Bijli Yojana / State Policy)",
  "summary": "2-3 sentence executive summary explaining why this capacity fits the user's bill and how the subsidy benefits them.",
  "documents": ["List of 4-5 essential documents required for national portal & DISCOM net-metering application"],
  "stateTips": "1-2 practical tips specific to ${location}'s DISCOM, net metering process, or additional state incentives."
}

Return ONLY valid JSON without markdown fences.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return {
      schemeName: 'PM Surya Ghar: Muft Bijli Yojana',
      summary: `A ${recommendedCapacity} kW system satisfies your ₹${monthlyBill} monthly bill with ₹${subsidy} in subsidy support.`,
      documents: ['Recent Electricity Bill', 'Aadhaar Card', 'Roof Ownership Proof', 'Bank Account Details'],
      stateTips: `Apply via national solar portal and choose an empaneled vendor registered in ${location}.`
    };
  }
}

module.exports = { getSolarSchemeAdvice };