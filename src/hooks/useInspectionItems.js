import { useState, useEffect } from 'react';
import { validateItemFields } from './useFormValidation';
import { nonLSLTolerances } from '../constants/tolerance';

export function useInspectionItems() {
  const [formValues, setFormValues] = useState({
    name: '',
    toleranceType: '',
    itemType: 'Variable',
    nominal: '',
    usl: '',
    lsl: '',
    controlPlan: 'N/A',
    method: '',
    sampleFreq: '',
    reportingFreq: '',
    evaluationMethod: '',
    isUnequalProfile: false,
    upperTolerance: '',
    lowerTolerance: '',
  });

  const [itemErrors, setItemErrors] = useState({});

  const isLSLDisabled = nonLSLTolerances.includes(formValues.toleranceType);

  useEffect(() => {
    if (isLSLDisabled && formValues.itemType !== 'Attribute') {
      setFormValues((prev) => ({ ...prev, lsl: 'n/a' }));
    }
  }, [isLSLDisabled, formValues.toleranceType, formValues.itemType]);

  const resetFormValues = () => {
    setFormValues({
      name: '',
      toleranceType: '',
      itemType: 'Variable',
      nominal: '',
      usl: '',
      lsl: '',
      controlPlan: 'N/A',
      method: '',
      sampleFreq: '',
      reportingFreq: '',
      evaluationMethod: '',
      isUnequalProfile: false,
      upperTolerance: '',
      lowerTolerance: '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => {
      if (name === 'itemType') {
        return {
          ...prev,
          itemType: value,
          usl: value === 'Attribute' ? 'NG' : '',
          lsl: value === 'Attribute' ? 'OK' : '',
        };
      }
      return { ...prev, [name]: value };
    });
    setItemErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateItems = () => {
    const errors = validateItemFields(formValues);
    setItemErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    formValues,
    setFormValues,
    itemErrors,
    setItemErrors,
    isLSLDisabled,
    resetFormValues,
    handleFormChange,
    validateItems,
  };
}
