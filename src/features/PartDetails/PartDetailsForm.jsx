// src/features/PartDetails/PartDetailsForm.jsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Stack
} from '@mui/material';

export default function PartDetailsForm({ partInfo, onChange }) {
  return (
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Part Details
        </Typography>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={1}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ gridColumn: 1, gridRow: 1 }}>
            <TextField
              size="small"
              label="Part Number"
              name="partNumber"
              value={partInfo.partNumber}
              onChange={onChange}
            />
            <FormControlLabel
              control={<Checkbox size="small" name="sideLeft" checked={partInfo.sideLeft} onChange={onChange} />}
              label="Left"
            />
            <FormControlLabel
              control={<Checkbox size="small" name="sideRight" checked={partInfo.sideRight} onChange={onChange} />}
              label="Right"
            />
          </Stack>

          <TextField
            size="small"
            label="Model"
            name="model"
            value={partInfo.model}
            onChange={onChange}
            sx={{ gridColumn: 2, gridRow: 1 }}
          />

          <TextField
            size="small"
            label="Part Name"
            name="partName"
            value={partInfo.partName}
            onChange={onChange}
            sx={{ gridColumn: 1, gridRow: 2 }}
          />

          <TextField
            size="small"
            label="Event"
            name="event"
            value={partInfo.event}
            onChange={onChange}
            sx={{ gridColumn: 2, gridRow: 2 }}
          />

          <TextField
            size="small"
            label="Supplier"
            name="supplier"
            value={partInfo.supplier}
            onChange={onChange}
            sx={{ gridColumn: 1, gridRow: 3 }}
          />

          <TextField
            size="small"
            label="Facility"
            name="facility"
            value={partInfo.facility}
            onChange={onChange}
            sx={{ gridColumn: 2, gridRow: 3 }}
          />

          <FormControl fullWidth size="small" sx={{ gridColumn: 1, gridRow: 4 }}>
            <InputLabel id="drawing-rank-label">Drawing Rank</InputLabel>
            <Select
              labelId="drawing-rank-label"
              name="drawingRank"
              value={partInfo.drawingRank}
              label="Drawing Rank"
              onChange={onChange}
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="None">None</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ gridColumn: 2, gridRow: 4 }}>
            <InputLabel id="reg-part-label">Regulation Part</InputLabel>
            <Select
              labelId="reg-part-label"
              name="regulationPart"
              value={partInfo.regulationPart}
              label="Regulation Part"
              onChange={onChange}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ gridColumn: '1 / 3', gridRow: 5 }}>
            <Typography variant="caption">Data Purpose</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <FormControlLabel
                control={<Checkbox size="small" name="dpRegular" checked={partInfo.dpRegular} onChange={onChange} />}
                label="Regular"
              />
              <FormControlLabel
                control={<Checkbox size="small" name="dpNewModel" checked={partInfo.dpNewModel} onChange={onChange} />}
                label="New Model"
              />
              <FormControlLabel
                control={<Checkbox size="small" name="dpProblem" checked={partInfo.dpProblem} onChange={onChange} />}
                label="Problem Investigation"
              />
              <FormControlLabel
                control={<Checkbox size="small" name="dpOther" checked={partInfo.dpOther} onChange={onChange} />}
                label="Other"
              />
              {partInfo.dpOther && (
                <TextField
                  size="small"
                  name="dpOtherText"
                  value={partInfo.dpOtherText}
                  onChange={onChange}
                  placeholder="Other Text"
                />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}