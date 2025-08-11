import { nonLSLTolerances } from '../constants/tolerance';

export const validatePartDetails = (info) => {
  const errors = {};
  const required = [
    'partNumber',
    'model',
    'partName',
    'event',
    'supplier',
    'facility',
    'drawingRank',
    'regulationPart',
  ];

  required.forEach((field) => {
    if (!info[field] || info[field].toString().trim() === '') {
      errors[field] = true;
    }
  });

  if (!info.sideLeft && !info.sideRight) {
    errors.side = true;
  }

  if (!info.dpRegular && !info.dpNewModel && !info.dpProblem && !info.dpOther) {
    errors.dp = true;
  }

  if (info.dpOther && info.dpOtherText.trim() === '') {
    errors.dpOtherText = true;
  }

  return errors;
};

export const validateItemFields = (values) => {
  const errors = {};
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

  required.forEach((field) => {
    if (!values[field] || values[field].toString().trim() === '') {
      errors[field] = true;
    }
  });

  const lslNeeded =
    values.itemType !== 'Attribute' && !nonLSLTolerances.includes(values.toleranceType);

  if (lslNeeded && (!values.lsl || values.lsl.toString().trim() === '')) {
    errors.lsl = true;
  }

  if (
    values.toleranceType === 'Other' &&
    (!values.customToleranceType || values.customToleranceType.trim() === '')
  ) {
    errors.customToleranceType = true;
  }

  return errors;
};

export const areItemFieldsComplete = (values) => {
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

  const baseComplete = required.every(
    (field) => values[field] && values[field].toString().trim() !== '',
  );

  const lslNeeded =
    values.itemType !== 'Attribute' && !nonLSLTolerances.includes(values.toleranceType);

  const lslComplete = !lslNeeded || (values.lsl && values.lsl.toString().trim() !== '');

  const customTolComplete =
    values.toleranceType !== 'Other' ||
    (values.customToleranceType && values.customToleranceType.toString().trim() !== '');

  return baseComplete && lslComplete && customTolComplete;
};
