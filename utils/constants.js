/* =========================================================
   SolarSense AI — Constants & Curated Assets
   ========================================================= */

// All 28 Indian States & 8 Union Territories
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

// Curated verified rooftop solar photography (High-res Unsplash direct URLs with graceful SVG fallbacks)
// Matches Reference Image 1 & 2: Residential sloped tile & flat roofs, warm morning sunlight, greenery
export const SOLAR_IMAGES = {
  // Main Hero photograph: Residential rooftop solar panels under warm morning sun surrounded by lush trees
  heroRooftop: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
  
  // Editorial Feature: Modern home with clean solar installation
  residentialHouse: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=900&q=80',
  
  // Close-up detail: High-efficiency solar silicon cells reflecting blue sky & sunlight
  solarCellsDetail: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=900&q=80',
  
  // Architecture & Nature: Sustainable living home with rooftop solar in lush landscape
  sustainableHome: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',

  // Clean energy landscape
  greenLandscape: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=900&q=80',
};

// Elegant inline SVG fallback pattern in case of offline/network block
export const FALLBACK_SOLAR_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23F8F7F0'/%3E%3Cstop offset='100%25' stop-color='%23DCE5D5'/%3E%3C/linearGradient%3E%3ClinearGradient id='panel' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23234B38'/%3E%3Cstop offset='100%25' stop-color='%2317382B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23sky)'/%3E%3Ccircle cx='680' cy='120' r='60' fill='%23D7A64A' opacity='0.7'/%3E%3Cpolygon points='100,500 400,280 700,500' fill='%23EDE8DC' stroke='%23879B7B' stroke-width='4'/%3E%3Cpolygon points='220,440 380,330 580,440 420,550' fill='url(%23panel)'/%3E%3Cpath d='M260,420 L460,530 M300,400 L500,510 M340,380 L540,490' stroke='%23879B7B' stroke-width='2' opacity='0.6'/%3E%3Ctext x='400' y='570' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23234B38'%3ESolarSense AI — Rooftop Solar Architecture%3C/text%3E%3C/svg%3E`;

// Default Calculator Inputs
export const DEFAULT_CALCULATOR_INPUTS = {
  location: 'Maharashtra',
  monthlyBill: 3000,
  roofArea: 500,
  electricityTariff: 8,
};

// Regulatory Disclaimer Text
export const DISCLAIMER_TEXT =
  'Estimates are indicative and calculated using standard regional solar irradiation models and PM Surya Ghar subsidy guidelines. Final generation, quotation, and subsidy eligibility depend on DISCOM technical feasibility, vendor quotation, and physical site survey.';
