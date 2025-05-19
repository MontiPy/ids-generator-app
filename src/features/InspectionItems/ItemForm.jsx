// src/features/InspectionItems/ItemForm.jsx
import React from 'react';
import {
  Box,
  Button,
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
  Typography
} from '@mui/material';

export default function ItemForm({
  formValues,
  onChange,
  onSubmit,
  isEdit,
  isLSLDisabled,
  toleranceGroups,
  toleranceIcons,
  controlPlans
}) {
  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="subtitle1" gutterBottom>
        {isEdit ? 'Edit' : 'Add'} Inspection Item
      </Typography>
      <Stack spacing={1}>
        <FormControl fullWidth size="small">
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
                sx={{ fontWeight: 'bold', fontSize: '0.9rem', bgcolor: 'background.paper', height:35 }}
              >
                {group}
              </ListSubheader>,
              ...types.map(type => (
                <MenuItem
                  key={type}
                  value={type}
                  sx={{ pl: 3, fontSize: '0.8rem' }}
                >
                  <Box
                    component="img"
                    src={toleranceIcons[type]}
                    alt={`${type} icon`}
                    sx={{ width: 20, height: 20, mr: 1 }}
                  />
                  <Box component="span">{type}</Box>
                </MenuItem>
              ))
            ])}
            <MenuItem value="Other" sx={{ pl: 3, fontSize: '0.8rem' }}>Not Listed</MenuItem>
          </Select>
        </FormControl>

        {/* Conditionally render the input box for "Not Listed" */}
        {formValues.toleranceType === "Other" && (
          <TextField
            size="small"
            fullWidth
            label="Specify Tolerance Type"
            name="customToleranceType" // Use a separate field for the custom input
            value={formValues.customToleranceType || ""} // Default to an empty string if undefined
            onChange={(e) => onChange({ target: { name: "customToleranceType", value: e.target.value } })}
          />
        )}

        <TextField
          size="small"
          fullWidth
          label="Inspection Item"
          name="name"
          value={formValues.name}
          onChange={onChange}
        />

        <FormControl component="fieldset" size="small">
          <RadioGroup
            row
            name="itemType"
            value={formValues.itemType}
            onChange={onChange}
          >
            <FormControlLabel
              value="Variable"
              control={<Radio />}
              label="Variable"
            />
            <FormControlLabel
              value="Attribute"
              control={<Radio />}
              label="Attribute"
            />
          </RadioGroup>
        </FormControl>

        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            label="Nominal"
            name="nominal"
            value={formValues.nominal}
            onChange={onChange}
          />
          <TextField
            size="small"
            label="USL"
            name="usl"
            value={formValues.itemType === 'Attribute' ? 'NG' : formValues.usl}
            onChange={onChange}
            disabled={formValues.itemType === 'Attribute'}
          />
          <TextField
            size="small"
            label="LSL"
            name="lsl"
            value={formValues.itemType === 'Attribute' ? 'OK' : formValues.lsl}
            onChange={onChange}
            disabled={formValues.itemType === 'Attribute' || isLSLDisabled}
          />
        </Stack>

        <Tooltip
          title={
            <>
              Mark N/A if the point is not a CCP or KQP <br /><br />
              CCP and KQP points are identified to ensure visibility of these items is maintained. <br /><br />
              CCP (Critical Control Point)- These line items are critical points that require variable data and statistical analysis to ensure part performance. <br /><br />
              KQP (Key Quality Point)- These line items are key points that ensure part performance, but do not require statistical analysis.
            </>
          }
        >
          <FormControl fullWidth size="small">
            <InputLabel id="cp-label">CCP/KQP/GMP</InputLabel>
            <Select
              labelId="cp-label"
              name="controlPlan"
              value={formValues.controlPlan}
              label="CCP/KQP/GMP"
              onChange={onChange}
              size="small"
            >
              {controlPlans.map(cp => (
                <MenuItem key={cp} value={cp}>
                  <Typography variant="caption">{cp}</Typography>
                </MenuItem>
              ))}
            </Select>
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
          />
        </Tooltip>

        <Button size="small" variant="contained" onClick={onSubmit}>
          {isEdit ? 'Save' : 'Add'}
        </Button>
      </Stack>
    </Box>
  );
}