// src/features/Export/excelExporter.js
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';

export async function exportToExcel(partInfo, items) {
  const response = await fetch('/template.xlsx');
  const arrayBuffer = await response.arrayBuffer();
  const workbook = await XlsxPopulate.fromDataAsync(arrayBuffer);

  // Named Range Population
  workbook.definedName('Part_Number').value(partInfo.partNumber || '');
  workbook.definedName('Model').value(partInfo.model || '');
  workbook.definedName('Part_Name').value(partInfo.partName || '');
  workbook.definedName('Event').value(partInfo.event || '');
  workbook.definedName('Supplier').value(partInfo.supplier || '');
  workbook.definedName('Facility').value(partInfo.facility || '');
  workbook.definedName('Drawing_Rank').value(partInfo.drawingRank || '');
  workbook.definedName('Regulation_Part').value(partInfo.regulationPart || '');
  workbook.definedName('Regular_Inspection_Box').value(partInfo.dpRegular);
  workbook.definedName('NM_Inspection_Box').value(partInfo.dpNewModel);
  workbook.definedName('Prob_Inv_Box').value(partInfo.dpProblem);
  workbook.definedName('Other_Box').value(partInfo.dpOther);
  if (partInfo.dpOther) {
    workbook.definedName('Other_Input').value(partInfo.dpOtherText || '');
  }
  workbook.definedName('Side_L_Box').value(partInfo.sideLeft);
  workbook.definedName('Side_R_Box').value(partInfo.sideRight);

  // Data from Tolerance Table
  // Read table header and rows from the DOM
  const table = document.getElementById('items-table');
  // const headers = Array.from(table.tHead.rows[0].cells)
  //   .slice(0, 11) // Skip 'No.' and 'Action' columns
  //   .map(cell => cell.innerText);

  const domData = Array.from(table.tBodies[0].rows).map(row =>
    Array.from(row.cells)
      .slice(0, 11) // Match the same columns
      .map(cell => cell.innerText)
  );
  
  // const headerNames = ['Header_No', 'Header_InspItem', 'Header_TolType', 'Header_CCP', 'Header_Method', 'Header_Sample', 'Header_Reporting', 'Header_LSL', 'Header_USL', 'Header_Nom'];
  const colOrder = [0,1,2,null,null,6,7,8,null,9,null,5,4,null,3];
  const domRearranged = domData.map(row => colOrder.map(colIdx => row[colIdx]));

  workbook.definedName('Table_Start1').value(domRearranged)

const blob = await workbook.outputAsync({ type: 'blob' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'IDS_Populated.xlsx';
a.click();
URL.revokeObjectURL(url);
}

export async function downloadTemplate() {
  const response = await fetch('/template.xlsx');
  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'template.xlsx';
  a.click();
  window.URL.revokeObjectURL(url);
}