// src/features/InspectionItems/useGroupedItems.js
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { nonLSLTolerances } from '../../constants/tolerance';

export default function useGroupedItems() {
  const [items, setItems] = useState([]);
  const [editGroupId, setEditGroupId] = useState(null);

  const generateItems = (formValues, groupId, tolWithXY, tolWithMinMax) => {
    const {
      name,
      toleranceType,
      nominal,
      usl,
      lsl,
      controlPlan,
      method,
      sampleFreq,
      reportingFreq,
    } = formValues;

    const subs = tolWithXY.includes(toleranceType)
      ? ['', 'X', 'Y']
      : tolWithMinMax.includes(toleranceType)
        ? ['', 'Min', 'Max']
        : [''];

    const createItem = (sub) => ({
      id: uuidv4(),
      groupId,
      name,
      toleranceType,
      subitem: sub,
      nominal,
      usl,
      lsl,
      controlPlan,
      method,
      sampleFreq,
      reportingFreq,
    });

    return subs.map(createItem);
  };

  const handleAddOrUpdate = (formValues, tolWithXY, tolWithMinMax, resetFormValues) => {
    const areItemFieldsComplete = (values) => {
      const required = [
        'toleranceType',
        'name',
        'nominal',
        'controlPlan',
        'method',
        'sampleFreq',
        'reportingFreq',
      ];
      if (values.itemType !== 'Attribute') {
        required.push('usl');
      }

      const baseComplete = required.every((f) => values[f] && values[f].toString().trim() !== '');

      const lslNeeded =
        values.itemType !== 'Attribute' && !nonLSLTolerances.includes(values.toleranceType);

      const lslComplete = !lslNeeded || (values.lsl && values.lsl.toString().trim() !== '');

      const customTolComplete =
        values.toleranceType !== 'Other' ||
        (values.customToleranceType && values.customToleranceType.toString().trim() !== '');

      return baseComplete && lslComplete && customTolComplete;
    };

    if (!areItemFieldsComplete(formValues)) {
      return;
    }

    // Handle custom tolerance type if "N/A" is selected
    const toleranceType =
      formValues.toleranceType === 'Other'
        ? formValues.customToleranceType
        : formValues.toleranceType;

    const updatedFormValues = {
      ...formValues,
      toleranceType, // Use the custom tolerance type if applicable
    };

    if (editGroupId) {
      setItems((prev) => {
        const others = prev.filter((i) => i.groupId !== editGroupId);
        return [
          ...others,
          ...generateItems(updatedFormValues, editGroupId, tolWithXY, tolWithMinMax),
        ];
      });
      setEditGroupId(null);
    } else {
      const newGroupId = uuidv4();
      setItems((prev) => [
        ...prev,
        ...generateItems(updatedFormValues, newGroupId, tolWithXY, tolWithMinMax),
      ]);
    }
    resetFormValues();
  };

  const handleEdit = (groupId, setFormValues) => {
    const groupItems = items.filter((i) => i.groupId === groupId);
    const first = groupItems[0];
    setFormValues({
      name: first.name,
      toleranceType: first.toleranceType,
      nominal: first.nominal,
      usl: first.usl,
      lsl: first.lsl,
      controlPlan: first.controlPlan,
      method: first.method,
      sampleFreq: first.sampleFreq,
      reportingFreq: first.reportingFreq,
      itemType: first.itemType || 'Variable',
    });
    setEditGroupId(groupId);
  };

  const handleDelete = (groupId, resetFormValues) => {
    setItems((prev) => prev.filter((i) => i.groupId !== groupId));
    if (editGroupId === groupId) {
      setEditGroupId(null);
      resetFormValues();
    }
  };

  return {
    items,
    setItems,
    editGroupId,
    setEditGroupId,
    handleAddOrUpdate,
    handleEdit,
    handleDelete,
  };
}
