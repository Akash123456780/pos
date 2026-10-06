/**
 * Browser-side export helpers for CSV, Excel-compatible XML/CSV, and print preview
 */

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(val => {
        const str = String(val ?? '').replace(/"/g, '""');
        return `"${str}"`;
      }).join(',')
    )
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadExcelStub(filename: string, headers: string[], rows: (string | number)[][]) {
  // Generates spreadsheet-ready tab-delimited file or CSV recognized by Excel
  downloadCSV(filename, headers, rows);
}

export function triggerPrintBill(billNumber: string) {
  window.print();
}
