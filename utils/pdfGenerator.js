/* =========================================================
   SolarSense AI — PDF Report Generator
   Preserves existing export flow with refined Evergreen branding & labelled assumptions.
   ========================================================= */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatRupees, formatKW, formatSqFt, formatUnits, formatTons } from './formatters';
import { DISCLAIMER_TEXT } from './constants';

export function exportSolarPDF(result) {
  if (!result) return;

  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  // Forest Green Header Banner
  doc.setFillColor(35, 75, 56); // #234B38
  doc.rect(0, 0, 210, 26, 'F');

  // Gold Accent Strip
  doc.setFillColor(215, 166, 74); // #D7A64A
  doc.rect(0, 26, 210, 2, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(248, 247, 240); // Warm ivory
  doc.text('SolarSense AI — Rooftop Solar Feasibility Report', 14, 17);

  // Subtitle / Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(119, 121, 111); // Muted stone
  const dateStr = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated on: ${dateStr}`, 14, 35);
  doc.text(`Region / State: ${result.location || 'India'}`, 14, 40);

  // Table 1: Inputs
  autoTable(doc, {
    startY: 45,
    head: [['Input Parameter', 'Homeowner Provided Value']],
    body: [
      ['State / Location', result.location || '—'],
      ['Average Monthly Electricity Bill', formatRupees(result.monthlyBill)],
      ['Available Rooftop Area', formatSqFt(result.roofArea)],
      ['Electricity Tariff', result.electricityTariff ? `₹${result.electricityTariff} / unit` : '—'],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [23, 56, 43], // Deep Evergreen
      textColor: [248, 247, 240],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: { fontSize: 8.5, cellPadding: 3 },
  });

  // Table 2: System Specifications
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 6,
    head: [['System Recommendation', 'Estimated Output']],
    body: [
      ['Recommended Solar System Capacity', formatKW(result.recommendedCapacity)],
      ['Estimated Number of Panels (550W)', `${result.numberOfPanels || '—'} Standard Panels`],
      ['Estimated Monthly Energy Generation', formatUnits(result.monthlyUnits)],
      ['Estimated Roof Space Required', formatSqFt(result.roofRequired)],
      ['Annual CO2 Emissions Avoided', formatTons(result.co2Reduction)],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [35, 75, 56], // Forest Green
      textColor: [248, 247, 240],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: { fontSize: 8.5, cellPadding: 3 },
  });

  // Table 3: Financial Summary & Projections
  const annualSavings = Number(result.annualSavings) || 0;
  const fiveYearSavings = annualSavings > 0 ? annualSavings * 5 : 0;

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 6,
    head: [['Financial Breakdown & Projections', 'Amount (INR)']],
    body: [
      ['Gross Estimated Installation Cost', formatRupees(result.installationCost)],
      ['Central Government Subsidy (PM Surya Ghar)', `- ${formatRupees(result.subsidy)}`],
      ['Net Out-of-Pocket Cost', formatRupees(result.finalCost)],
      ['Estimated Annual Electricity Savings', formatRupees(result.annualSavings)],
      ['5-Year Projected Cumulative Savings (approx. constant tariff)', formatRupees(fiveYearSavings)],
      ['Estimated Payback Period', result.paybackPeriod ? `${result.paybackPeriod} Years` : '—'],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [135, 155, 123], // Sage Green
      textColor: [23, 56, 43],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: { fontSize: 8.5, cellPadding: 3 },
  });

  // Table 4: AI & Scheme Guidance (If available)
  if (result.aiAdvice) {
    const ai = result.aiAdvice;
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 6,
      head: [['AI Scheme & Regulatory Guidance', 'Details']],
      body: [
        ['Recommended Government Scheme', ai.schemeName || 'PM Surya Ghar: Muft Bijli Yojana'],
        ['Consultant Summary', ai.summary || 'Eligible for central rooftop solar subsidy.'],
        ['State & DISCOM Guidance', ai.stateTips || 'Verify net metering regulations with local utility.'],
        ['Required Documentation', Array.isArray(ai.documents) ? ai.documents.join(', ') : 'ID, Electricity Bill, Roof Proof'],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [215, 166, 74], // Solar Gold
        textColor: [41, 45, 40],
        fontStyle: 'bold',
        fontSize: 9,
      },
      styles: { fontSize: 8.5, cellPadding: 3 },
    });
  }

  // Official Regulatory Disclaimer Note
  const finalY = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(119, 121, 111);
  doc.text('Important Disclaimer:', 14, finalY);
  const splitDisclaimer = doc.splitTextToSize(DISCLAIMER_TEXT, 182);
  doc.text(splitDisclaimer, 14, finalY + 4);

  // Clean filename
  const cleanLoc = (result.location || 'Rooftop').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`SolarSense_Report_${cleanLoc}_${Date.now()}.pdf`);
}
