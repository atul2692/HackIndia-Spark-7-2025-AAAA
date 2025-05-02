'use client';

import React, { useState } from 'react';
import jsPDF from 'jspdf';

interface PDFReportProps {
  analysisResult: any;
  protectedAttribute: string;
  datasetName: string;
}

const PDFReport: React.FC<PDFReportProps> = ({ 
  analysisResult, 
  protectedAttribute,
  datasetName
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const getAttributeSpecificInfo = () => {
    if (!analysisResult) return null;

    switch (protectedAttribute) {
      case 'gender':
        return {
          title: "Gender Fairness Analysis",
          description: "Analysis of bias between male and female groups",
          privilegedGroup: "Male",
          unprivilegedGroup: "Female",
          interpretation: analysisResult.bias_detected 
            ? "There appears to be gender bias in the outcomes. The model treats males and females differently."
            : "No significant gender bias detected in the outcomes."
        };
      case 'age':
        return {
          title: "Age Fairness Analysis",
          description: "Analysis of bias between age groups (threshold: 30 years)",
          privilegedGroup: "Age ≥ 30",
          unprivilegedGroup: "Age < 30",
          interpretation: analysisResult.bias_detected 
            ? "There appears to be age-based bias in the outcomes. Younger and older individuals are treated differently."
            : "No significant age-based bias detected in the outcomes."
        };
      case 'income':
        return {
          title: "Income Fairness Analysis",
          description: "Analysis of bias between income levels (threshold: $50,000)",
          privilegedGroup: "Income ≥ $50,000",
          unprivilegedGroup: "Income < $50,000",
          interpretation: analysisResult.bias_detected 
            ? "There appears to be income-based bias in the outcomes. Lower and higher income individuals are treated differently."
            : "No significant income-based bias detected in the outcomes."
        };
      default:
        return {
          title: "Fairness Analysis",
          description: "Analysis of bias in outcomes",
          privilegedGroup: "Privileged group",
          unprivilegedGroup: "Unprivileged group",
          interpretation: "See detailed metrics for more information."
        };
    }
  };

  // Format date as YYYY-MM-DD
  const formatDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      
      const attributeInfo = getAttributeSpecificInfo();
      
      // Add fonts for a more professional look
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let y = margin;
      
      // Helper function to add text with wrapping
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, align: 'left' | 'center' | 'right' | 'justify' = 'left') => {
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y, { align });
        return y + (lines.length * lineHeight);
      };
      
      // Define colors
      const primaryColor = [41, 65, 148]; // Deep blue
      const secondaryColor = [83, 123, 196]; // Medium blue
      const accentColor = [110, 165, 245]; // Light blue
      const neutralColor = [80, 80, 80]; // Dark gray
      const lightNeutralColor = [240, 240, 245]; // Light gray
      
      // Draw header background
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      // Add vertical accent line
      pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      pdf.rect(0, 0, 10, pageHeight, 'F');
      
      // Add page number to all pages (will be added as we add pages)
      const addPageNumber = (pageNum: number) => {
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      };
      
      // Add header to every page - will be called each time we add a new page
      const addHeader = () => {
        // Logo
        pdf.setFillColor(255, 255, 255);
        pdf.circle(25, 20, 10, 'F');
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('FS', 25, 24, { align: 'center' });
        
        // Title
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(18);
        pdf.text('FairSight AI', 45, 20);
        pdf.setFontSize(10);
        pdf.text('Fairness Evaluation Report', 45, 26);
        
        // Date
        pdf.setFontSize(9);
        pdf.setTextColor(220, 220, 220);
        pdf.text(`Generated: ${formatDate()}`, pageWidth - margin, 20, { align: 'right' });
      };
      
      // Add footer to every page
      const addFooter = () => {
        const footerY = pageHeight - 15;
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(130, 130, 130);
        pdf.text('FairSight AI - AI Fairness Evaluation Platform', pageWidth / 2, footerY, { align: 'center' });
        pdf.text('www.fairsight-ai.com', pageWidth / 2, footerY + 5, { align: 'center' });
      };
      
      // Start first page
      addHeader();
      addFooter();
      addPageNumber(1);
      
      // Set starting y after header
      y = 50;
      
      // Title Page
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('AI Evaluation Report', pageWidth / 2, y, { align: 'center' });
      
      y += 15;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(14);
      pdf.setTextColor(neutralColor[0], neutralColor[1], neutralColor[2]);
      pdf.text(`Dataset: ${datasetName}`, pageWidth / 2, y, { align: 'center' });
      
      y += 10;
      pdf.setFontSize(12);
      pdf.text(`Protected Attribute: ${protectedAttribute}`, pageWidth / 2, y, { align: 'center' });
      
      // Add fairness score indicator
      y += 30;
      // Score circle
      const scoreX = pageWidth / 2;
      const scoreRadius = 25;
      
      // Score circle background
      pdf.setFillColor(245, 245, 250);
      pdf.circle(scoreX, y, scoreRadius, 'F');
      
      // Score circle border
      let scoreColor;
      if (analysisResult.fairness_score > 0.8) scoreColor = [30, 160, 80]; // green
      else if (analysisResult.fairness_score > 0.6) scoreColor = secondaryColor; // blue
      else if (analysisResult.fairness_score > 0.4) scoreColor = [240, 150, 30]; // orange
      else scoreColor = [210, 50, 50]; // red
      
      pdf.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      pdf.setLineWidth(2);
      pdf.circle(scoreX, y, scoreRadius, 'S');
      
      // Score text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      pdf.text(`${(analysisResult.fairness_score * 100).toFixed(0)}%`, scoreX, y + 8, { align: 'center' });
      
      // Score label
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Fairness Score', scoreX, y + 20, { align: 'center' });
      
      // Executive summary
      y += 45;
      pdf.setFillColor(lightNeutralColor[0], lightNeutralColor[1], lightNeutralColor[2]);
      pdf.roundedRect(margin + 10, y, pageWidth - (margin * 2) - 10, 35, 3, 3, 'F');
      
      y += 8;
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Executive Summary', margin + 20, y);
      
      y += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(neutralColor[0], neutralColor[1], neutralColor[2]);
      const summary = analysisResult.bias_detected 
        ? `This evaluation has detected bias with respect to ${protectedAttribute} in the dataset. The model treats privileged and unprivileged groups differently.` 
        : `No significant bias was detected with respect to ${protectedAttribute} in the dataset. The model treats privileged and unprivileged groups fairly.`;
      y = addWrappedText(summary, margin + 20, y, pageWidth - (margin * 2) - 30, 5);
      
      // Key information
      y += 20;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('Key Information', margin + 10, y);
      
      y += 10;
      const infoTable = [
        { label: 'Analysis Type', value: attributeInfo?.title || 'Fairness Analysis' },
        { label: 'Privileged Group', value: attributeInfo?.privilegedGroup || 'Not specified' },
        { label: 'Unprivileged Group', value: attributeInfo?.unprivilegedGroup || 'Not specified' },
        { label: 'Bias Detected', value: analysisResult.bias_detected ? 'Yes' : 'No' }
      ];
      
      pdf.setDrawColor(220, 220, 220);
      pdf.setFillColor(250, 250, 255);
      
      const tableMargin = margin + 10;
      const tableWidth = pageWidth - (tableMargin * 2);
      const colWidth1 = tableWidth * 0.4;
      const colWidth2 = tableWidth * 0.6;
      const rowHeight = 10;
      
      // Draw table
      infoTable.forEach((row, i) => {
        const rowY = y + (i * rowHeight);
        // Row background (alternating)
        if (i % 2 === 0) {
          pdf.setFillColor(250, 250, 255);
        } else {
          pdf.setFillColor(240, 240, 250);
        }
        pdf.rect(tableMargin, rowY, tableWidth, rowHeight, 'F');
        
        // Row data
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 140);
        pdf.text(row.label, tableMargin + 5, rowY + 7);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.text(row.value, tableMargin + colWidth1 + 5, rowY + 7);
        
        // Border
        pdf.setDrawColor(220, 220, 230);
        pdf.setLineWidth(0.1);
        pdf.rect(tableMargin, rowY, tableWidth, rowHeight, 'S');
      });
      
      y += (infoTable.length * rowHeight) + 20;
      
      // Add new page for Metrics
      pdf.addPage();
      y = 50; // Reset y position after header
      let pageCount = 2;
      
      addHeader();
      addFooter();
      addPageNumber(pageCount);
      
      // Metrics section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('Fairness Metrics', pageWidth / 2, y, { align: 'center' });
      
      // Add description
      y += 15;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(neutralColor[0], neutralColor[1], neutralColor[2]);
      y = addWrappedText(
        'Below are the key metrics used to evaluate the fairness of the model. These metrics help quantify the difference in treatment between privileged and unprivileged groups.',
        margin + 10, y, pageWidth - (margin * 2) - 10, 5
      );
      
      // Metrics visualization
      y += 15;
      
      // Create metric boxes in a 2x2 grid
      const metrics = [
        { 
          name: 'Statistical Parity Difference', 
          value: analysisResult.report_data?.metrics?.statistical_parity_difference || 'N/A',
          desc: 'Difference in positive outcome rates between privileged and unprivileged groups.'
        },
        { 
          name: 'Disparate Impact', 
          value: analysisResult.report_data?.metrics?.disparate_impact || 'N/A',
          desc: 'Ratio of positive outcome rates between unprivileged and privileged groups.'
        },
        { 
          name: 'SPD After Reweighing', 
          value: analysisResult.report_data?.metrics?.reweighed_statistical_parity_difference || 'N/A',
          desc: 'Statistical Parity Difference after applying mitigation through reweighting.'
        },
        { 
          name: 'DI After Reweighing', 
          value: analysisResult.report_data?.metrics?.reweighed_disparate_impact || 'N/A',
          desc: 'Disparate Impact after applying mitigation through reweighting.'
        }
      ];
      
      const boxWidth = (pageWidth - (margin * 2) - 10) / 2;
      const boxHeight = 55;
      const boxMargin = 5;
      
      // Draw metrics boxes
      metrics.forEach((metric, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const boxX = margin + (col * (boxWidth + boxMargin));
        const boxY = y + (row * (boxHeight + boxMargin));
        
        // Box background
        pdf.setFillColor(248, 248, 255);
        pdf.setDrawColor(220, 220, 235);
        pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2, 'FD');
        
        // Metric name
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text(metric.name, boxX + 10, boxY + 12);
        
        // Metric value
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        pdf.text(String(metric.value), boxX + 10, boxY + 28);
        
        // Metric description
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 120);
        pdf.text(metric.desc, boxX + 10, boxY + 40, {
          maxWidth: boxWidth - 20
        });
      });
      
      y += (boxHeight * 2) + (boxMargin * 2) + 25;
      
      // Add new page for Insights
      pdf.addPage();
      y = 50; // Reset y position after header
      pageCount++;
      
      addHeader();
      addFooter();
      addPageNumber(pageCount);
      
      // Insights & Recommendations
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('Insights & Recommendations', pageWidth / 2, y, { align: 'center' });
      
      // Interpretation box
      y += 20;
      pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
      pdf.setFillColor(245, 248, 255);
      pdf.roundedRect(margin + 10, y, pageWidth - (margin * 2) - 10, 30, 2, 2, 'FD');
      
      y += 15;
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(11);
      pdf.setTextColor(60, 80, 120);
      pdf.text(attributeInfo?.interpretation || 'Analysis complete.', pageWidth/2, y, { align: 'center' });
      
      y += 35;
      
      // Key Insights section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('Key Insights', margin + 10, y);
      
      // Draw insights
      y += 10;
      pdf.setDrawColor(240, 240, 250);
      pdf.setFillColor(250, 250, 255);
      pdf.roundedRect(margin + 10, y, pageWidth - (margin * 2) - 10, 4 + (analysisResult.report_data?.insights?.length || 1) * 12, 2, 2, 'FD');
      
      y += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 100);
      
      if (analysisResult.report_data?.insights && analysisResult.report_data?.insights.length) {
        for (let i = 0; i < analysisResult.report_data.insights.length; i++) {
          const insight = analysisResult.report_data.insights[i];
          // Bullet point
          pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
          pdf.circle(margin + 18, y - 2, 1.2, 'F');
          // Insight text
          y = addWrappedText(insight, margin + 25, y, pageWidth - (margin * 2) - 35, 5);
          y += 7;
          
          // Check if we need a new page
          if (y > pageHeight - 50 && i < analysisResult.report_data.insights.length - 1) {
            pdf.addPage();
            pageCount++;
            addHeader();
            addFooter();
            addPageNumber(pageCount);
            y = 50;
          }
        }
      } else {
        pdf.text('No specific insights available.', margin + 25, y);
        y += 15;
      }
      
      y += 10;
      
      // Recommendations section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('Recommendations', margin + 10, y);
      
      y += 10;
      // Recommendations box
      const recommendations = analysisResult.bias_detected ? [
        'Use the provided reweighted dataset to train a bias-mitigated model.',
        'Consider additional preprocessing techniques like disparate impact remover or post-processing methods.',
        'Investigate why bias is occurring and if additional features could help reduce it.'
      ] : [
        'Continue monitoring for fairness as new data is added to the system.',
        'Verify fairness across other protected attributes not covered in this analysis.'
      ];
      
      pdf.setDrawColor(240, 240, 250);
      pdf.setFillColor(250, 250, 255);
      pdf.roundedRect(margin + 10, y, pageWidth - (margin * 2) - 10, 4 + recommendations.length * 12, 2, 2, 'FD');
      
      y += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 100);
      
      for (let i = 0; i < recommendations.length; i++) {
        const recommendation = recommendations[i];
        // Bullet point
        pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
        pdf.circle(margin + 18, y - 2, 1.2, 'F');
        // Recommendation text
        y = addWrappedText(recommendation, margin + 25, y, pageWidth - (margin * 2) - 35, 5);
        y += 7;
        
        // Check if we need a new page
        if (y > pageHeight - 50 && i < recommendations.length - 1) {
          pdf.addPage();
          pageCount++;
          addHeader();
          addFooter();
          addPageNumber(pageCount);
          y = 50;
        }
      }
      
      y += 15;
      
      // Conclusion
      if (y > pageHeight - 80) {
        pdf.addPage();
        pageCount++;
        addHeader();
        addFooter();
        addPageNumber(pageCount);
        y = 50;
      } else {
        y += 10;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('Conclusion', margin + 10, y);
      
      y += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 100);
      
      const conclusionText = analysisResult.bias_detected ? 
        `This fairness evaluation has detected bias with respect to ${protectedAttribute} in the analyzed dataset. 
        The fairness score of ${(analysisResult.fairness_score * 100).toFixed(1)}% indicates room for improvement.
        We recommend implementing the provided mitigation strategies to create a more fair and equitable model.` : 
        `This fairness evaluation has not detected significant bias with respect to ${protectedAttribute} in the analyzed dataset.
        The fairness score of ${(analysisResult.fairness_score * 100).toFixed(1)}% indicates the model is performing well in terms of fairness.
        Continue monitoring fairness as the model and data evolve over time.`;
      
      pdf.setDrawColor(240, 240, 250);
      pdf.setFillColor(250, 250, 255);
      pdf.roundedRect(margin + 10, y, pageWidth - (margin * 2) - 10, 30, 2, 2, 'FD');
      
      y += 10;
      addWrappedText(conclusionText, margin + 20, y, pageWidth - (margin * 2) - 40, 5);
      
      // Save the PDF
      pdf.save(`FairSight_AI_Report_${datasetName}_${protectedAttribute}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Show error notification
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center disabled:opacity-75"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF Report
          </>
        )}
      </button>
    </div>
  );
};

export default PDFReport; 