import { renderHook, act } from '@testing-library/react';
import useGroupedItems from '../useGroupedItems';

test('adds a single item when tolerance type has no subitems', () => {
  const { result } = renderHook(() => useGroupedItems());
  act(() => {
    result.current.handleAddOrUpdate(
      {
        name: 'Item1',
        toleranceType: 'Flatness',
        itemType: 'Variable',
        nominal: '10',
        usl: '11',
        lsl: '9',
        controlPlan: 'N/A',
        method: 'Gauge',
        sampleFreq: 'Every part',
        reportingFreq: 'Monthly',
      },
      [],
      [],
      () => {},
    );
  });
  expect(result.current.items).toHaveLength(1);
});

test('adds subitems when tolerance type requires XY', () => {
  const { result } = renderHook(() => useGroupedItems());
  act(() => {
    result.current.handleAddOrUpdate(
      {
        name: 'Item2',
        toleranceType: 'Radial',
        itemType: 'Variable',
        nominal: '5',
        usl: '5.5',
        lsl: 'n/a',
        controlPlan: 'N/A',
        method: 'CMM',
        sampleFreq: '5 per shift',
        reportingFreq: 'Daily',
      },
      ['Radial'],
      [],
      () => {},
    );
  });
  expect(result.current.items).toHaveLength(3);
});

test('does not add item when required fields are missing', () => {
  const { result } = renderHook(() => useGroupedItems());
  act(() => {
    result.current.handleAddOrUpdate(
      {
        name: '',
        toleranceType: '',
        nominal: '',
        usl: '',
        lsl: '',
        controlPlan: 'N/A',
        method: '',
        sampleFreq: '',
        reportingFreq: '',
      },
      [],
      [],
      () => {},
    );
  });
  expect(result.current.items).toHaveLength(0);
});
