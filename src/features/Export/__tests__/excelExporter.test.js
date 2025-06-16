import { prepareExportRows } from '../excelExporter';

const sampleItems = [
  {
    id: '1',
    groupId: 'g1',
    name: 'Hole Dia',
    toleranceType: 'Radial',
    nominal: '10',
    usl: '10.5',
    lsl: '9.5',
    controlPlan: 'N/A',
    method: 'Gauge',
    sampleFreq: '1/shift',
    reportingFreq: 'Monthly',
    subitem: ''
  },
  {
    id: '2',
    groupId: 'g1',
    name: 'Hole Dia',
    toleranceType: 'Radial',
    nominal: '10',
    usl: '10.5',
    lsl: '9.5',
    controlPlan: 'N/A',
    method: 'Gauge',
    sampleFreq: '1/shift',
    reportingFreq: 'Monthly',
    subitem: 'X'
  }
];

test('prepareExportRows maps items to excel rows', () => {
  const rows = prepareExportRows(sampleItems);
  expect(rows.length).toBe(2);
  expect(rows[0][0]).toBe(1);
  expect(rows[1][1]).toBe('Hole Dia - X');
});
