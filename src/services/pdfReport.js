import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateAssessmentPDF(assessment) {
  if (!assessment) return false;

  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RAININTEL', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Rooftop Rainwater Harvesting Assessment Report', 105, 30, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(14, 35, 196, 35);
  
  // Format Data
  const nf = (val) => val !== null && val !== undefined && val !== '' ? val : 'Not available';
  
  const assessmentData = [
    ['Assessment ID', `RIN-2026-${String(nf(assessment.assessmentId)).padStart(4, '0')}`],
    ['Building Name', nf(assessment.buildingName)],
    ['Building Type', nf(assessment.buildingType)],
    ['Status', nf(assessment.status)],
    ['Created At', assessment.createdAt ? new Date(assessment.createdAt).toLocaleString() : 'Not available']
  ];
  
  const locationData = [
    ['Address', nf(assessment.address)],
    ['District', nf(assessment.districtName)],
    ['Latitude', nf(assessment.latitude)],
    ['Longitude', nf(assessment.longitude)]
  ];
  
  const roofData = [
    ['Roof Area', `${nf(assessment.roofAreaSqFt)} square feet`],
    ['Roof Material', nf(assessment.roofMaterial)],
    ['Roof Slope', nf(assessment.roofSlope)],
    ['Runoff Coefficient', nf(assessment.runoffCoefficient)],
    ['Annual Rainfall', `${nf(assessment.annualRainfallMm)} millimeters`]
  ];
  
  const waterData = [
    ['Water Demand', `${nf(assessment.waterDemandLpd)} Liters`],
    ['Harvest Potential', `${nf(assessment.harvestPotentialL)} Liters`],
    ['Recharge Potential', `${nf(assessment.rechargePotentialL)} Liters`],
    ['Recommended Storage Capacity', `${nf(assessment.recommendedStorageL || assessment.storageCapacityL)} Liters`]
  ];
  
  const recommendationData = [
    ['System Type', nf(assessment.systemType)],
    ['Filter Type', nf(assessment.filterType)],
    ['Recharge Type', nf(assessment.rechargeType)],
    ['Recommendation Reason', nf(assessment.recommendationReason)]
  ];
  
  const confidenceData = [
    ['Confidence Score', nf(assessment.confidenceScore)]
  ];

  let currentY = 45;

  autoTable(doc, {
    startY: currentY,
    head: [['Assessment Information', '']],
    body: assessmentData,
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110] },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } }
  });
  currentY = doc.lastAutoTable.finalY + 10;
  
  autoTable(doc, {
    startY: currentY,
    head: [['Location', '']],
    body: locationData,
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110] },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } }
  });
  currentY = doc.lastAutoTable.finalY + 10;
  
  autoTable(doc, {
    startY: currentY,
    head: [['Roof / Catchment Information', '']],
    body: roofData,
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110] },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } }
  });
  
  // Add new page if necessary
  if (doc.lastAutoTable.finalY > 230) {
    doc.addPage();
    currentY = 20;
  } else {
    currentY = doc.lastAutoTable.finalY + 10;
  }

  autoTable(doc, {
    startY: currentY,
    head: [['Water Analysis', '']],
    body: waterData,
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110] },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } }
  });
  currentY = doc.lastAutoTable.finalY + 10;
  
  autoTable(doc, {
    startY: currentY,
    head: [['RWH Recommendation', '']],
    body: recommendationData,
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110] },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } }
  });
  currentY = doc.lastAutoTable.finalY + 10;
  
  autoTable(doc, {
    startY: currentY,
    head: [['Confidence', '']],
    body: confidenceData,
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110] },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } }
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('RainIntel - Jal Shakti Mission Assessment Platform', 105, 285, { align: 'center' });
  }
  
  const filename = `RainIntel_Assessment_${assessment.assessmentId || 'Unknown'}.pdf`;
  doc.save(filename);
  
  return true;
}
