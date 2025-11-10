import { nonLSLTolerances, tolWithMinMax } from '../constants/tolerance';

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

  // Check if this is an unequal profile tolerance
  const isProfileTolerance = tolWithMinMax.includes(values.toleranceType);
  const unequalProfile = values.isUnequalProfile && isProfileTolerance;

  if (unequalProfile) {
    // For unequal profile tolerances, require upper and lower tolerance
    if (!values.upperTolerance || values.upperTolerance.toString().trim() === '') {
      errors.upperTolerance = true;
    }
    if (!values.lowerTolerance || values.lowerTolerance.toString().trim() === '') {
      errors.lowerTolerance = true;
    }
  } else {
    // For non-unequal tolerances, use standard validation
    if (values.itemType !== 'Attribute') {
      required.push('usl');
    }
  }

  required.forEach((field) => {
    if (!values[field] || values[field].toString().trim() === '') {
      errors[field] = true;
    }
  });

  // LSL validation (only if not unequal profile)
  if (!unequalProfile) {
    const lslNeeded =
      values.itemType !== 'Attribute' && !nonLSLTolerances.includes(values.toleranceType);

    if (lslNeeded && (!values.lsl || values.lsl.toString().trim() === '')) {
      errors.lsl = true;
    }
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

  // Check if this is an unequal profile tolerance
  const isProfileTolerance = tolWithMinMax.includes(values.toleranceType);
  const unequalProfile = values.isUnequalProfile && isProfileTolerance;

  if (unequalProfile) {
    // For unequal profile tolerances, require upper and lower tolerance
    required.push('upperTolerance', 'lowerTolerance');
  } else {
    // For non-unequal tolerances, use standard validation
    if (values.itemType !== 'Attribute') {
      required.push('usl');
    }
  }

  const baseComplete = required.every(
    (field) => values[field] && values[field].toString().trim() !== '',
  );

  // LSL validation (only if not unequal profile)
  let lslComplete = true;
  if (!unequalProfile) {
    const lslNeeded =
      values.itemType !== 'Attribute' && !nonLSLTolerances.includes(values.toleranceType);
    lslComplete = !lslNeeded || (values.lsl && values.lsl.toString().trim() !== '');
  }

  const customTolComplete =
    values.toleranceType !== 'Other' ||
    (values.customToleranceType && values.customToleranceType.toString().trim() !== '');

  return baseComplete && lslComplete && customTolComplete;
};
