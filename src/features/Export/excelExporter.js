// src/features/Export/excelExporter.js
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';

async function fetchTemplate() {
  const response = await fetch('/template.xlsx');
  return response.arrayBuffer();
}

export function prepareExportRows(items) {
  const grouped = Array.from(new Set(items.map((i) => i.groupId)));
  const rows = [];

  grouped.forEach((gid, idx) => {
    const main = items.find((x) => x.groupId === gid && !x.subitem);
    if (!main) return;

    rows.push([
      idx + 1,
      main.name,
      main.toleranceType,
      main.nominal,
      main.usl,
      main.lsl,
      main.controlPlan,
      main.method,
      main.sampleFreq,
      main.reportingFreq,
    ]);

    items
      .filter((x) => x.groupId === gid && x.subitem)
      .forEach((item, j) => {
        rows.push([
          `${idx + 1}${String.fromCharCode(97 + j)}`,
          `${item.name} - ${item.subitem}`,
          item.toleranceType,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ]);
      });
  });

  const colOrder = [0, 1, 2, null, null, 6, 7, 8, null, 9, null, 5, 4, null, 3];
  return rows.map((row) => colOrder.map((colIdx) => (colIdx === null ? '' : row[colIdx])));
}

export async function exportToExcel(partInfo, items) {
  const arrayBuffer = await fetchTemplate();
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

  const rows = prepareExportRows(items);
  workbook.definedName('Table_Start1').value(rows);

  const blob = await workbook.outputAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'IDS_Populated.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadTemplate() {
  const arrayBuffer = await fetchTemplate();
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'template.xlsx';
  a.click();
  window.URL.revokeObjectURL(url);
}
