// src/features/InspectionItems/useGroupedItems.js
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { areItemFieldsComplete } from '../../hooks/useFormValidation';

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
      evaluationMethod,
      isUnequalProfile,
      upperTolerance,
      lowerTolerance,
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
      evaluationMethod: evaluationMethod || '',
      isUnequalProfile: isUnequalProfile || false,
      upperTolerance: upperTolerance || '',
      lowerTolerance: lowerTolerance || '',
    });

    return subs.map(createItem);
  };

  const handleAddOrUpdate = (formValues, tolWithXY, tolWithMinMax, resetFormValues) => {
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
        // Find the index of the first item with this groupId to maintain position
        const firstIndex = prev.findIndex((i) => i.groupId === editGroupId);
        const others = prev.filter((i) => i.groupId !== editGroupId);
        const updatedItems = generateItems(
          updatedFormValues,
          editGroupId,
          tolWithXY,
          tolWithMinMax,
        );

        // Insert updated items at the original position
        return [...others.slice(0, firstIndex), ...updatedItems, ...others.slice(firstIndex)];
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
      evaluationMethod: first.evaluationMethod || '',
      isUnequalProfile: first.isUnequalProfile || false,
      upperTolerance: first.upperTolerance || '',
      lowerTolerance: first.lowerTolerance || '',
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

  const handleDuplicate = (groupId) => {
    const groupItems = items.filter((i) => i.groupId === groupId);
    const newGroupId = uuidv4();
    const duplicatedItems = groupItems.map((item) => ({
      ...item,
      id: uuidv4(),
      groupId: newGroupId,
    }));
    setItems((prev) => [...prev, ...duplicatedItems]);
  };

  return {
    items,
    setItems,
    editGroupId,
    setEditGroupId,
    handleAddOrUpdate,
    handleEdit,
    handleDelete,
    handleDuplicate,
  };
}
