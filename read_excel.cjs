const xlsx = require('xlsx');

const workbook = xlsx.readFile('c:\\Users\\itzme\\Downloads\\Bundles (1).xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

console.log(JSON.stringify(data.slice(0, 10), null, 2));
