import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function DownloadButton({ transactions }) {
  const handleDownload = () => {
    // 1. Transaction Data
    const transactionRows = transactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      Merchant: t.merchant,
      Category: t.category,
      Type: t.type.toUpperCase(),
      Amount: t.amount
    }));

    // 2. Calculate Summary
    let totalIncome = 0;
    let totalExpenses = 0;
    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += Number(t.amount);
      if (t.type === 'expense') totalExpenses += Number(t.amount);
    });

    // 3. Combine into one Sheet
    // Add 2 empty rows for spacing, then the Summary
    const finalData = [
      ...transactionRows,
      {}, // Empty Spacer Row
      { Date: '--- SUMMARY ---' },
      { Date: 'Total Income', Amount: totalIncome },
      { Date: 'Total Expenses', Amount: totalExpenses },
      { Date: 'Total Balance', Amount: totalIncome - totalExpenses }
    ];

    // Create Workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(finalData);
    
    // Auto-adjust column widths (basic)
    const wscols = [
      {wch: 15}, {wch: 25}, {wch: 20}, {wch: 15}, {wch: 15}
    ];
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Finance Report");

    // Save File
    XLSX.writeFile(wb, `Finance_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <button 
      className="btn btn-icon" 
      onClick={handleDownload}
      style={{ 
        gap: '8px', 
        paddingLeft: '16px', 
        paddingRight: '16px',
        border: '1px solid var(--border-color)',
        fontWeight: 600
      }}
      title="Download Excel Report"
    >
      <Download size={18} />
      <span>Export</span>
    </button>
  );
}
