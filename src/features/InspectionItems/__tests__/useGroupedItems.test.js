import { renderHook, act } from '@testing-library/react';
import useGroupedItems from '../useGroupedItems';

test('adds a single item when tolerance type has no subitems', () => {
  const { result } = renderHook(() => useGroupedItems());
  act(() => {
    result.current.handleAddOrUpdate(
      {
        name: 'Item1',
        toleranceType: 'Flatness',
        nominal: '',
        usl: '',
        lsl: '',
        controlPlan: 'N/A',
        method: '',
        sampleFreq: '',
        reportingFreq: ''
      },
      [],
      [],
      () => {}
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
        nominal: '',
        usl: '',
        lsl: '',
        controlPlan: 'N/A',
        method: '',
        sampleFreq: '',
        reportingFreq: ''
      },
      ['Radial'],
      [],
      () => {}
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
        reportingFreq: ''
      },
      [],
      [],
      () => {}
    );
  });
  expect(result.current.items).toHaveLength(0);
});
