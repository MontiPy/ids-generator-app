import { useState } from 'react';
import { validatePartDetails } from './useFormValidation';

export function usePartDetails() {
  const [partInfo, setPartInfo] = useState({
    partNumber: '',
    partName: '',
    supplier: '',
    model: '',
    event: '',
    facility: '',
    drawingRank: '',
    regulationPart: '',
    sideLeft: false,
    sideRight: false,
    dpRegular: false,
    dpNewModel: false,
    dpProblem: false,
    dpOther: false,
    dpOtherText: '',
  });

  const [partErrors, setPartErrors] = useState({});

  const handlePartChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPartInfo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setPartErrors((prev) => {
      const newErr = { ...prev };
      if (name === 'sideLeft' || name === 'sideRight') {
        newErr.side = false;
      } else if (name.startsWith('dp')) {
        newErr.dp = false;
        if (name === 'dpOtherText') {
          newErr.dpOtherText = false;
        }
      } else {
        newErr[name] = false;
      }
      return newErr;
    });
  };

  const validatePart = () => {
    const errors = validatePartDetails(partInfo);
    setPartErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    partInfo,
    partErrors,
    handlePartChange,
    validatePart,
    setPartErrors,
  };
}
