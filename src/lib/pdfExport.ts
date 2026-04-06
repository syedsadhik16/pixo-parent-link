/**
 * PDF Export utility for PIXO Parent Connect reports.
 * Uses browser print API for reliable cross-browser PDF generation.
 */

export function exportReportAsPdf(childName: string, reportType: string, periodLabel: string) {
  const printContent = document.getElementById('report-print-area');
  if (!printContent) {
    // Fallback: print the current page
    window.print();
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PIXO Report - ${childName} - ${periodLabel}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          padding: 32px;
          background: #fff;
        }
        h1, h2, h3, h4 { font-family: 'Nunito', sans-serif; }
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #f97316;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .report-header h1 { font-size: 20px; color: #f97316; }
        .report-header .meta { font-size: 12px; color: #64748b; text-align: right; }
        .report-header .brand { font-size: 14px; font-weight: 700; color: #f97316; }
        .section { margin-bottom: 20px; }
        .section h3 { font-size: 14px; margin-bottom: 8px; color: #1e293b; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .stat-card {
          background: #fef3e2;
          border: 1px solid #fed7aa;
          border-radius: 8px;
          padding: 12px;
        }
        .stat-card .label { font-size: 11px; color: #64748b; }
        .stat-card .value { font-size: 18px; font-weight: 700; font-family: 'Nunito', sans-serif; }
        .tag {
          display: inline-block;
          background: #dcfce7;
          color: #16a34a;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 999px;
          margin: 2px;
        }
        .tag.warn { background: #fee2e2; color: #dc2626; }
        .insight { font-size: 13px; color: #475569; line-height: 1.6; }
        .footer {
          margin-top: 32px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
          font-size: 10px;
          color: #94a3b8;
          text-align: center;
        }
        @media print {
          body { padding: 16px; }
          @page { margin: 1cm; }
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <div>
          <div class="brand">PIXO Parent Connect</div>
          <h1>${reportType} Report</h1>
        </div>
        <div class="meta">
          <div>${childName}</div>
          <div>${periodLabel}</div>
          <div>Generated: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>
      ${printContent.innerHTML}
      <div class="footer">
        PIXO Parent Connect &mdash; Energy. Learn. Grow. &mdash; Generated on ${new Date().toLocaleString()}
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
}
