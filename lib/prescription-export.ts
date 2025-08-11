import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PrescriptionData {
  id: string;
  number: string;
  date: string;
  patient: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  prescriberName?: string;
  prescriberRegNo?: string;
  diagnosis?: string;
  advice?: string;
  followUpDate?: string;
  items: Array<{
    medicineName: string;
    strength?: string;
    dosage?: string;
    frequency?: string;
    route?: string;
    durationDays?: number;
    instructions?: string;
  }>;
}

export function exportToPDF(prescription: PrescriptionData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  
  let currentY = 30;
  
  // Prescription Header (Clean, no branding)
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('PRESCRIPTION', pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;
  
  // Prescription Number and Date
  doc.setFontSize(11);
  doc.text(`Prescription No: ${prescription.number}`, margin, currentY);
  doc.text(`Date: ${new Date(prescription.date).toLocaleDateString()}`, pageWidth - margin - 60, currentY);
  currentY += 20;
  
  // Patient Information
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text('Patient Information:', margin, currentY);
  currentY += 8;
  
  doc.setFontSize(10);
  doc.text(`Name: ${prescription.patient.firstName} ${prescription.patient.lastName}`, margin + 5, currentY);
  currentY += 6;
  
  if (prescription.patient.email) {
    doc.text(`Email: ${prescription.patient.email}`, margin + 5, currentY);
    currentY += 6;
  }
  if (prescription.patient.phone) {
    doc.text(`Phone: ${prescription.patient.phone}`, margin + 5, currentY);
    currentY += 6;
  }
  currentY += 10;
  
  // Check if we need a new page for medicines table
  if (currentY > 180) {
    doc.addPage();
    currentY = 30;
  }
  
  // Medicines Table (moved up)
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text('Medicines:', margin, currentY);
  currentY += 8;
  
  const tableData = prescription.items.map((item, index) => [
    (index + 1).toString(),
    item.medicineName || '-',
    item.strength || '-',
    item.dosage || '-',
    item.frequency || '-',
    item.route || '-',
    item.durationDays ? `${item.durationDays} days` : '-',
    item.instructions || '-'
  ]);
  
  autoTable(doc, {
    startY: currentY,
    head: [['S.No', 'Medicine', 'Strength', 'Dosage', 'Frequency', 'Route', 'Duration', 'Instructions']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [70, 70, 70],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: 0,
      lineWidth: 0.1
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 32 },
      2: { cellWidth: 22 },
      3: { cellWidth: 22 },
      4: { cellWidth: 22 },
      5: { cellWidth: 18 },
      6: { cellWidth: 18 },
      7: { cellWidth: 30 }
    },
    margin: { left: margin, right: margin },
    styles: {
      overflow: 'linebreak',
      cellWidth: 'wrap',
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    didDrawPage: function(data) {
      // Add page number
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  });
  
  // Get the final Y position after table
  const finalY = (doc as any).lastAutoTable?.finalY || 250;
  let nextY = finalY + 15;
  
  // Diagnosis (if available) - moved after medicines
  if (prescription.diagnosis) {
    // Check if we need a new page
    if (nextY > pageHeight - 60) {
      doc.addPage();
      nextY = 30;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Diagnosis:', margin, nextY);
    nextY += 8;
    
    doc.setFontSize(10);
    const diagnosisLines = doc.splitTextToSize(prescription.diagnosis, contentWidth - 10);
    doc.text(diagnosisLines, margin + 5, nextY);
    nextY += (diagnosisLines.length * 6) + 15;
  }
  
  // Follow-up Date (if available) - moved after diagnosis
  if (prescription.followUpDate) {
    // Check if we need a new page
    if (nextY > pageHeight - 40) {
      doc.addPage();
      nextY = 30;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Follow-up:', margin, nextY);
    nextY += 8;
    
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(prescription.followUpDate).toLocaleDateString()}`, margin + 5, nextY);
    nextY += 15;
  }
  
  // Advice (if available)
  if (prescription.advice) {
    // Check if we need a new page
    if (nextY > pageHeight - 60) {
      doc.addPage();
      nextY = 30;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Advice:', margin, nextY);
    nextY += 8;
    
    doc.setFontSize(10);
    const adviceLines = doc.splitTextToSize(prescription.advice, contentWidth - 10);
    doc.text(adviceLines, margin + 5, nextY);
    nextY += (adviceLines.length * 6) + 15;
  }
  
  // Doctor Information (moved to bottom)
  if (prescription.prescriberName) {
    // Check if we need a new page
    if (nextY > pageHeight - 60) {
      doc.addPage();
      nextY = 30;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Prescriber Information:', margin, nextY);
    nextY += 8;
    
    doc.setFontSize(10);
    doc.text(`Name: ${prescription.prescriberName}`, margin + 5, nextY);
    nextY += 6;
    if (prescription.prescriberRegNo) {
      doc.text(`Registration No: ${prescription.prescriberRegNo}`, margin + 5, nextY);
      nextY += 6;
    }
  }
  
  // Save the PDF
  doc.save(`prescription-${prescription.number}.pdf`);
}

export function exportToCSV(prescription: PrescriptionData) {
  const csvData = [
    ['PRESCRIPTION'],
    ['Prescription No', prescription.number],
    ['Date', new Date(prescription.date).toLocaleDateString()],
    [''],
    ['Patient Information'],
    ['Name', `${prescription.patient.firstName} ${prescription.patient.lastName}`],
    ['Email', prescription.patient.email || ''],
    ['Phone', prescription.patient.phone || ''],
    [''],
    ['Prescriber Information'],
    ['Name', prescription.prescriberName || ''],
    ['Registration No', prescription.prescriberRegNo || ''],
    [''],
    ['Diagnosis', prescription.diagnosis || ''],
    [''],
    ['Medicines'],
    ['S.No', 'Medicine', 'Strength', 'Dosage', 'Frequency', 'Route', 'Duration', 'Instructions']
  ];
  
  prescription.items.forEach((item, index) => {
    csvData.push([
      (index + 1).toString(),
      item.medicineName,
      item.strength || '',
      item.dosage || '',
      item.frequency || '',
      item.route || '',
      item.durationDays ? item.durationDays.toString() : '',
      item.instructions || ''
    ]);
  });
  
  if (prescription.followUpDate) {
    csvData.push(['']);
    csvData.push(['Follow-up Date', new Date(prescription.followUpDate).toLocaleDateString()]);
  }
  
  if (prescription.advice) {
    csvData.push(['']);
    csvData.push(['Advice', prescription.advice]);
  }
  
  const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `prescription-${prescription.number}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToWord(prescription: PrescriptionData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Prescription ${prescription.number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; color: #333; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section-title { color: #333; font-weight: bold; margin-bottom: 10px; }
        .medicine-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .medicine-table th, .medicine-table td { border: 1px solid #333; padding: 8px; text-align: left; }
        .medicine-table th { background-color: #f5f5f5; color: #333; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>PRESCRIPTION</h1>
        <p><strong>Prescription No:</strong> ${prescription.number}</p>
        <p><strong>Date:</strong> ${new Date(prescription.date).toLocaleDateString()}</p>
      </div>
      
                    <div class="section">
         <div class="section-title">Patient Information</div>
         <p><strong>Name:</strong> ${prescription.patient.firstName} ${prescription.patient.lastName}</p>
         ${prescription.patient.email ? `<p><strong>Email:</strong> ${prescription.patient.email}</p>` : ''}
         ${prescription.patient.phone ? `<p><strong>Phone:</strong> ${prescription.patient.phone}</p>` : ''}
       </div>
       
       <div class="section">
         <div class="section-title">Medicines</div>
         <table class="medicine-table">
           <thead>
             <tr>
               <th>S.No</th>
               <th>Medicine</th>
               <th>Strength</th>
               <th>Dosage</th>
               <th>Frequency</th>
               <th>Route</th>
               <th>Duration</th>
               <th>Instructions</th>
             </tr>
           </thead>
           <tbody>
             ${prescription.items.map((item, index) => `
               <tr>
                 <td>${index + 1}</td>
                 <td>${item.medicineName}</td>
                 <td>${item.strength || '-'}</td>
                 <td>${item.dosage || '-'}</td>
                 <td>${item.frequency || '-'}</td>
                 <td>${item.route || '-'}</td>
                 <td>${item.durationDays ? `${item.durationDays} days` : '-'}</td>
                 <td>${item.instructions || '-'}</td>
               </tr>
             `).join('')}
           </tbody>
         </table>
       </div>
       
       ${prescription.diagnosis ? `
       <div class="section">
         <div class="section-title">Diagnosis</div>
         <p>${prescription.diagnosis}</p>
       </div>
       ` : ''}
       
       ${prescription.followUpDate ? `
       <div class="section">
         <div class="section-title">Follow-up</div>
         <p><strong>Follow-up Date:</strong> ${new Date(prescription.followUpDate).toLocaleDateString()}</p>
       </div>
       ` : ''}
       
       ${prescription.advice ? `
       <div class="section">
         <div class="section-title">Advice</div>
         <p>${prescription.advice}</p>
       </div>
       ` : ''}
       
       ${prescription.prescriberName ? `
       <div class="section">
         <div class="section-title">Prescriber Information</div>
         <p><strong>Name:</strong> ${prescription.prescriberName}</p>
         ${prescription.prescriberRegNo ? `<p><strong>Registration No:</strong> ${prescription.prescriberRegNo}</p>` : ''}
       </div>
       ` : ''}
    </body>
    </html>
  `;
  
  const blob = new Blob([htmlContent], { type: 'application/msword' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `prescription-${prescription.number}.doc`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printPrescription(prescription: PrescriptionData) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Prescription ${prescription.number}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .print-container {
          width: 100%;
          max-width: 800px;
          padding: 60px 40px;
          box-sizing: border-box;
        }
        .section { margin-bottom: 25px; }
        .section-title { 
          color: #333; 
          font-weight: bold; 
          margin-bottom: 12px; 
          font-size: 16px;
          border-bottom: 2px solid #333;
          padding-bottom: 5px;
        }
        .medicine-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0; 
          font-size: 12px;
        }
        .medicine-table th, .medicine-table td { 
          border: 1px solid #333; 
          padding: 8px; 
          text-align: left; 
        }
        .medicine-table th { 
          background-color: #f5f5f5; 
          color: #333; 
          font-weight: bold;
        }
        .prescription-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #333;
          padding-bottom: 20px;
        }
        .prescription-header h1 {
          font-size: 24px;
          margin: 0 0 10px 0;
          color: #333;
        }
        .prescription-header p {
          font-size: 14px;
          margin: 5px 0;
          color: #666;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
        }
        .info-label {
          font-weight: bold;
          color: #333;
        }
        .info-value {
          color: #666;
        }
        @media print {
          body { 
            margin: 0; 
            padding: 0;
          }
          .print-container {
            padding: 40px 30px;
          }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        <div class="prescription-header">
          <h1>PRESCRIPTION</h1>
          <p><strong>Prescription No:</strong> ${prescription.number}</p>
          <p><strong>Date:</strong> ${new Date(prescription.date).toLocaleDateString()}</p>
        </div>
        
                 <div class="section">
           <div class="section-title">Patient Information</div>
           <div class="info-row">
             <span class="info-label">Name:</span>
             <span class="info-value">${prescription.patient.firstName} ${prescription.patient.lastName}</span>
           </div>
           ${prescription.patient.email ? `
           <div class="info-row">
             <span class="info-label">Email:</span>
             <span class="info-value">${prescription.patient.email}</span>
           </div>
           ` : ''}
           ${prescription.patient.phone ? `
           <div class="info-row">
             <span class="info-label">Phone:</span>
             <span class="info-value">${prescription.patient.phone}</span>
           </div>
           ` : ''}
         </div>
         
         <div class="section">
           <div class="section-title">Medicines</div>
          <table class="medicine-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Medicine</th>
                <th>Strength</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Route</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${prescription.items.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.medicineName}</td>
                  <td>${item.strength || '-'}</td>
                  <td>${item.dosage || '-'}</td>
                  <td>${item.frequency || '-'}</td>
                  <td>${item.route || '-'}</td>
                  <td>${item.durationDays ? `${item.durationDays} days` : '-'}</td>
                  <td>${item.instructions || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
                     </table>
         </div>
         
         ${prescription.diagnosis ? `
         <div class="section">
           <div class="section-title">Diagnosis</div>
           <p style="margin: 0; color: #666;">${prescription.diagnosis}</p>
         </div>
         ` : ''}
         
         ${prescription.followUpDate ? `
         <div class="section">
           <div class="section-title">Follow-up</div>
           <div class="info-row">
             <span class="info-label">Follow-up Date:</span>
             <span class="info-value">${new Date(prescription.followUpDate).toLocaleDateString()}</span>
           </div>
         </div>
         ` : ''}
         
         ${prescription.advice ? `
         <div class="section">
           <div class="section-title">Advice</div>
           <p style="margin: 0; color: #666; line-height: 1.5;">${prescription.advice}</p>
         </div>
         ` : ''}
         
         ${prescription.prescriberName ? `
         <div class="section">
           <div class="section-title">Prescriber Information</div>
           <div class="info-row">
             <span class="info-label">Name:</span>
             <span class="info-value">${prescription.prescriberName}</span>
           </div>
           ${prescription.prescriberRegNo ? `
           <div class="info-row">
             <span class="info-label">Registration No:</span>
             <span class="info-value">${prescription.prescriberRegNo}</span>
           </div>
           ` : ''}
         </div>
         ` : ''}
      </div>
      
      <div class="no-print" style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Print Prescription
        </button>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
}
