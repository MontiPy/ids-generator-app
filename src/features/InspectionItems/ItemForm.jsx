// src/features/InspectionItems/ItemForm.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListSubheader,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  FormHelperText,
  Card,
  CardContent,
} from '@mui/material';
import { tolWithMinMax } from '../../constants/tolerance';

function ItemForm({
  formValues,
  onChange,
  onSubmit,
  isEdit,
  isLSLDisabled,
  toleranceGroups,
  toleranceIcons,
  controlPlans,
  errors = {},
}) {
  const isProfileTolerance = tolWithMinMax.includes(formValues.toleranceType);
  return (
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Box component="form" noValidate autoComplete="off">
          <Typography variant="subtitle1" gutterBottom>
            {isEdit ? 'Edit' : 'Add'} Inspection Item
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl sx={{ flex: 1 }} size="small" error={Boolean(errors.toleranceType)}>
                <InputLabel id="tol-type-label">Tolerance</InputLabel>
                <Select
                  labelId="tol-type-label"
                  id="tol-type"
                  name="toleranceType"
                  value={formValues.toleranceType}
                  label="Tolerance Type"
                  onChange={onChange}
                >
                  {Object.entries(toleranceGroups).map(([group, types]) => [
                    <ListSubheader
                      key={group}
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        bgcolor: 'background.paper',
                        height: 35,
                      }}
                    >
                      {group}
                    </ListSubheader>,
                    ...types.map((type) => (
                      <MenuItem key={type} value={type} sx={{ pl: 3, fontSize: '0.8rem' }}>
                        <Box
                          component="img"
                          src={toleranceIcons[type]}
                          alt={`${type} icon`}
                          sx={{ width: 20, height: 20, mr: 1 }}
                        />
                        <Box component="span">{type}</Box>
                      </MenuItem>
                    )),
                  ])}
                  <MenuItem value="Other" sx={{ pl: 3, fontSize: '0.8rem' }}>
                    <Box
                      component="img"
                      src={toleranceIcons['Other']} // Replace with the appropriate icon source
                      alt="Not Listed icon"
                      sx={{ width: 20, height: 20, mr: 1 }}
                    />
                    <Box component="span">Not Listed</Box>
                  </MenuItem>
                </Select>
                {errors.toleranceType && <FormHelperText>Required</FormHelperText>}
              </FormControl>

              {/* Conditionally render the input box for "Not Listed" */}
              {formValues.toleranceType === 'Other' && (
                <TextField
                  size="small"
                  sx={{ flex: 1 }}
                  label="Specify Tolerance Type"
                  name="customToleranceType" // Use a separate field for the custom input
                  value={formValues.customToleranceType || ''} // Default to an empty string if undefined
                  onChange={(e) =>
                    onChange({
                      target: {
                        name: 'customToleranceType',
                        value: e.target.value,
                      },
                    })
                  }
                  error={Boolean(errors.customToleranceType)}
                  helperText={errors.customToleranceType && 'Required'}
                />
              )}
            </Box>

            <TextField
              size="small"
              fullWidth
              label="Inspection Item"
              name="name"
              value={formValues.name}
              onChange={onChange}
              error={Boolean(errors.name)}
              helperText={errors.name && 'Required'}
            />

            <FormControl component="fieldset" size="small">
              <RadioGroup row name="itemType" value={formValues.itemType} onChange={onChange}>
                <FormControlLabel value="Variable" control={<Radio />} label="Variable" />
                <FormControlLabel value="Attribute" control={<Radio />} label="Attribute" />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="eval-method-label">Mass Pro Evaluation Method</InputLabel>
              <Select
                labelId="eval-method-label"
                name="evaluationMethod"
                value={formValues.evaluationMethod}
                label="Mass Pro Evaluation Method"
                onChange={onChange}
                size="small"
              >
                <MenuItem value="">
                  <Typography variant="caption">N/A</Typography>
                </MenuItem>
                <MenuItem value="Variable">
                  <Typography variant="caption">Variable</Typography>
                </MenuItem>
                <MenuItem value="Attribute">
                  <Typography variant="caption">Attribute</Typography>
                </MenuItem>
              </Select>
            </FormControl>

            {isProfileTolerance && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.isUnequalProfile}
                    onChange={(e) =>
                      onChange({
                        target: {
                          name: 'isUnequalProfile',
                          value: e.target.checked,
                        },
                      })
                    }
                    name="isUnequalProfile"
                  />
                }
                label="Unequal Tolerances"
              />
            )}

            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                label="Nominal"
                name="nominal"
                value={formValues.nominal}
                onChange={onChange}
                error={Boolean(errors.nominal)}
                helperText={errors.nominal && 'Required'}
              />
              {formValues.isUnequalProfile && isProfileTolerance ? (
                <>
                  <TextField
                    size="small"
                    label="Upper Tol (+)"
                    name="upperTolerance"
                    value={formValues.upperTolerance}
                    onChange={onChange}
                    error={Boolean(errors.upperTolerance)}
                    helperText={errors.upperTolerance && 'Required'}
                  />
                  <TextField
                    size="small"
                    label="Lower Tol (-)"
                    name="lowerTolerance"
                    value={formValues.lowerTolerance}
                    onChange={onChange}
                    error={Boolean(errors.lowerTolerance)}
                    helperText={errors.lowerTolerance && 'Required'}
                  />
                </>
              ) : (
                <>
                  <TextField
                    size="small"
                    label="USL"
                    name="usl"
                    value={formValues.usl}
                    onChange={onChange}
                    disabled={formValues.itemType === 'Attribute'}
                    error={Boolean(errors.usl)}
                    helperText={errors.usl && 'Required'}
                  />
                  <TextField
                    size="small"
                    label="LSL"
                    name="lsl"
                    value={formValues.lsl}
                    onChange={onChange}
                    disabled={formValues.itemType === 'Attribute' || isLSLDisabled}
                    error={Boolean(errors.lsl)}
                    helperText={errors.lsl && 'Required'}
                  />
                </>
              )}
            </Stack>

            <Tooltip
              title={
                <>
                  Mark N/A if the point is not a CCP or KQP <br />
                  <br />
                  CCP and KQP points are identified to ensure visibility of these items is
                  maintained. <br />
                  <br />
                  CCP (Critical Control Point)- These line items are critical points that require
                  variable data and statistical analysis to ensure part performance. <br />
                  <br />
                  KQP (Key Quality Point)- These line items are key points that ensure part
                  performance, but do not require statistical analysis. <br />
                  <br />
                  GMP (Global Measurement Point)- These line items are global standards across
                  shared models. <br />
                  <br />
                </>
              }
            >
              <FormControl fullWidth size="small" error={Boolean(errors.controlPlan)}>
                <InputLabel id="cp-label">CCP/KQP/GMP</InputLabel>
                <Select
                  labelId="cp-label"
                  name="controlPlan"
                  value={formValues.controlPlan}
                  label="CCP/KQP/GMP"
                  onChange={onChange}
                  size="small"
                >
                  {controlPlans.map((cp) => (
                    <MenuItem key={cp} value={cp}>
                      <Typography variant="caption">{cp}</Typography>
                    </MenuItem>
                  ))}
                </Select>
                {errors.controlPlan && <FormHelperText>Required</FormHelperText>}
              </FormControl>
            </Tooltip>

            <Tooltip title="What measurement device will take the data?">
              <TextField
                size="small"
                fullWidth
                label="Method"
                name="method"
                value={formValues.method}
                onChange={onChange}
                error={Boolean(errors.method)}
                helperText={errors.method && 'Required'}
              />
            </Tooltip>

            <Tooltip title="How often will data be taken on this line item?">
              <TextField
                size="small"
                fullWidth
                label="Sample & Freq"
                name="sampleFreq"
                value={formValues.sampleFreq}
                onChange={onChange}
                error={Boolean(errors.sampleFreq)}
                helperText={errors.sampleFreq && 'Required'}
              />
            </Tooltip>

            <Tooltip title="How often will results be reported to Honda?">
              <TextField
                size="small"
                fullWidth
                label="Report Freq"
                name="reportingFreq"
                value={formValues.reportingFreq}
                onChange={onChange}
                error={Boolean(errors.reportingFreq)}
                helperText={errors.reportingFreq && 'Required'}
              />
            </Tooltip>

            <Button size="small" variant="contained" onClick={onSubmit}>
              {isEdit ? 'Save' : 'Add'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

ItemForm.propTypes = {
  formValues: PropTypes.shape({
    name: PropTypes.string,
    toleranceType: PropTypes.string,
    itemType: PropTypes.string,
    nominal: PropTypes.string,
    usl: PropTypes.string,
    lsl: PropTypes.string,
    controlPlan: PropTypes.string,
    method: PropTypes.string,
    sampleFreq: PropTypes.string,
    reportingFreq: PropTypes.string,
    customToleranceType: PropTypes.string,
    evaluationMethod: PropTypes.string,
    isUnequalProfile: PropTypes.bool,
    upperTolerance: PropTypes.string,
    lowerTolerance: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  isLSLDisabled: PropTypes.bool,
  toleranceGroups: PropTypes.object.isRequired,
  toleranceIcons: PropTypes.object.isRequired,
  controlPlans: PropTypes.arrayOf(PropTypes.string).isRequired,
  errors: PropTypes.object,
};

export default ItemForm;
