/**
 * Data Export Utility for Smart Dairy Management System
 * Supports CSV export for Herd Ear-Tag Register, Milk Collections, and Co-op Payments.
 */

export function exportToCSV(filename, headers, rows) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportHerdRegisterCSV(cows) {
  const headers = ['Ear Tag ID', 'Breed', 'Status', 'Lactation Count', 'Current Daily Yield (L)', 'Expected Calving Date'];
  const rows = cows.map(c => [
    c.tagNumber,
    c.breed?.replace(/_/g, ' ') || '',
    c.status || '',
    c.lactationCount || 1,
    c.currentMilkYieldLitres || 0,
    c.expectedCalvingDate || 'N/A'
  ]);
  exportToCSV('Herd_Register', headers, rows);
}

export function exportMilkLogsCSV(logs) {
  const headers = ['Date', 'Ear Tag ID', 'Session', 'Quantity (L)', 'Fat %', 'Estimated Payment (INR)'];
  const rows = logs.map(l => [
    l.date || '',
    l.cowTag || l.cow?.tagNumber || `TN-GJ-00${l.cowId}`,
    l.session || '',
    l.quantityLitres || 0,
    l.fatPercentage || 4.5,
    l.earnings || Math.round((l.quantityLitres || 0) * 48)
  ]);
  exportToCSV('Milk_Collection_Report', headers, rows);
}
