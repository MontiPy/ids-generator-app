// src/constants/tolerance.js

export const toleranceGroups = {
  "Form Tolerances": [
    'Flatness', 'Straightness', 'Cylindricity', 'Circularity/Roundness'
  ],
  "Orientation Tolerances": [
    'Perpendicularity', 'Parallelism', 'Angularity'
  ],
  "Location Tolerances": [
    'Position', 'Concentricity', 'Symmetry'
  ],
  "Profile Tolerances": [
    'Profile of a Surface', 'Profile of a Line'
  ],
  "Runout Tolerances": [
    'Total Runout', 'Circular Runout'
  ],
  "Other": [
    'Direct Dimension', 'Radial'
  ]
};

export const toleranceIcons = {
  'Angularity': '/icons/angularity.svg',
  'Circularity/Roundness': '/icons/circularity.svg',
  'Concentricity': '/icons/concentricity.svg',
  'Cylindricity': '/icons/cylindricity.svg',
  'Flatness': '/icons/flatness.svg',
  'Profile of a Line': '/icons/line-profile.svg',
  'Profile of a Surface': '/icons/surface-profile.svg',
  'Parallelism': '/icons/parallelism.svg',
  'Perpendicularity': '/icons/perpendicularity.svg',
  'Position': '/icons/position.svg',
  'Circular Runout': '/icons/runout.svg',
  'Total Runout': '/icons/total-runout.svg',
  'Symmetry': '/icons/symmetry.svg',
  'Straightness': '/icons/straightness.svg',
  'Direct Dimension': '/icons/plus-minus.svg',
  'Radial': '/icons/radial.svg',
  'Other': '/icons/question-mark-circle.svg',
};

export const controlPlans = ['CCP', 'KQP', 'CMP', 'N/A'];

export const nonLSLTolerances = [
  'Position', 'Radial', 'Profile of a Surface', 'Flatness', 'Straightness', 'Cylindricity',
  'Circularity/Roundness', 'Perpendicularity', 'Parallelism', 'Angularity', 'Profile of a Line',
  'Total Runout', 'Circular Runout', 'Concentricity', 'Symmetry'
];

export const tolWithXY = ['Radial', 'Position'];
export const tolWithMinMax = ['Profile of a Surface', 'Profile of a Line'];
