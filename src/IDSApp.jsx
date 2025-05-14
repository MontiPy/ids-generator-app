import React, { useState, useEffect } from 'react';
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
  Button,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Radio,
  RadioGroup,
  ListSubheader
} from '@mui/material';
import { Edit, Delete } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';

// -----------------------------------------------------------------------------
// Constants: define dropdown options and tolerance behaviors
// -----------------------------------------------------------------------------

// List of all tolerance types for the Tolerance dropdown
const toleranceTypes = [
  'Direct Dimension','Radial','Position','Profile of a Surface','Profile of a Line',
  'Flatness','Straightness','Cylindricity','Circularity/Roundness','Perpendicularity',
  'Parallelism','Angularity','Total Runout','Circular Runout','Concentricity','Symmetry'
];

const toleranceGroups = {
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

const toleranceIcons = {
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
};

// Options for the Control Plan dropdown
const controlPlans = ['CCP','KQP','CMP','N/A'];

// Tolerance types that should disable the LSL input (no lower spec limit)
const nonLSLTolerances = [
  'Position','Radial','Profile of a Surface','Flatness','Straightness','Cylindricity',
  'Circularity/Roundness','Perpendicularity','Parallelism','Angularity','Profile of a Line',
  'Total Runout','Circular Runout','Concentricity','Symmetry'
];

// Tolerance types that generate separate X & Y subitems
const tolWithXY = ['Radial','Position'];
// Tolerance types that generate separate Min & Max subitems
const tolWithMinMax = ['Profile of a Surface','Profile of a Line'];

// -----------------------------------------------------------------------------
// Main component: IDSApp
// -----------------------------------------------------------------------------
export default function IDSApp() {
  // --------------------------
  // Part Details state
  // --------------------------
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
    dpOtherText: ''
  });

  // --------------------------
  // Inspection items state
  // --------------------------
  const [items, setItems] = useState([]);

  // --------------------------
  // Form inputs for Add/Edit Item
  // --------------------------
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
    reportingFreq: ''
  });

  // Which groupId is currently being edited (null when adding new)
  const [editGroupId, setEditGroupId] = useState(null);

  // Determine if LSL input should be disabled based on selected tolerance type
  const isLSLDisabled = nonLSLTolerances.includes(formValues.toleranceType);

  // If LSL is disabled, automatically set its value to 'n/a'
  useEffect(() => {
    if (isLSLDisabled) {
      setFormValues(prev => ({ ...prev, lsl: 'n/a' }));
    }
  }, [formValues.toleranceType]);

  // ---------------------------------------------------------------------------
  // Handlers for Part Details inputs
  // ---------------------------------------------------------------------------
  const handlePartChange = e => {
    const { name, value, type, checked } = e.target;
    setPartInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ---------------------------------------------------------------------------
  // Handlers for Add/Edit Item form inputs
  // ---------------------------------------------------------------------------
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    })); console.log(formValues.itemType)
  };

  // ---------------------------------------------------------------------------
  // Generate item objects based on tolerance type:
  // - XY types => separate X and Y subitems
  // - Min/Max types => separate Min and Max subitems
  // - Others => single item
  // ---------------------------------------------------------------------------
  const generateItems = groupId => {
    const {
      name,
      toleranceType,
      nominal,
      usl,
      lsl,
      controlPlan,
      method,
      sampleFreq,
      reportingFreq
    } = formValues;
    
    if (tolWithXY.includes(toleranceType)) {
      return ['','X','Y'].map(sub => ({
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
        reportingFreq
      }));
    }
    else if (tolWithMinMax.includes(toleranceType)) {
      return ['','Min','Max'].map(sub => ({
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
        reportingFreq
      }));
    }
    
    // Default: single item with no subitem
    return [{
      id: uuidv4(),
      groupId,
      name,
      toleranceType,
      subitem: '',
      nominal,
      usl,
      lsl,
      controlPlan,
      method,
      sampleFreq,
      reportingFreq
    }];
  };
  
  // ---------------------------------------------------------------------------
  // Add a new item group or update an existing one
  // ---------------------------------------------------------------------------
  const handleAddOrUpdate = () => {
    if (!formValues.name) return; // require an item name

    if (editGroupId) {
      // Update: remove old group then add regenerated items
      setItems(prev => {
        const others = prev.filter(i => i.groupId !== editGroupId);
        return [...others, ...generateItems(editGroupId)];
      });
      setEditGroupId(null);
    } else {
      // Add: generate a new groupId
      const newGroupId = uuidv4();
      setItems(prev => [...prev, ...generateItems(newGroupId)]);
    }

    // Reset the form values
    setFormValues({
      name: '',
      toleranceType: '',
      nominal: '',
      usl: '',
      lsl: '',
      controlPlan: 'N/A',
      method: '',
      sampleFreq: '',
      reportingFreq: ''
    });
  };

  // ---------------------------------------------------------------------------
  // Populate the form for editing an existing group
  // ---------------------------------------------------------------------------
  const handleEdit = groupId => {
    const groupItems = items.filter(i => i.groupId === groupId);
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
      reportingFreq: first.reportingFreq
    });
    setEditGroupId(groupId);
  };

  // ---------------------------------------------------------------------------
  // Delete an item group and clear form if editing that group
  // ---------------------------------------------------------------------------
  const handleDelete = groupId => {
    setItems(prev => prev.filter(i => i.groupId !== groupId));
    if (editGroupId === groupId) {
      setEditGroupId(null);
      setFormValues({
        name: '',
        toleranceType: '',
        nominal: '',
        usl: '',
        lsl: '',
        controlPlan: 'N/A',
        method: '',
        sampleFreq: '',
        reportingFreq: ''
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Export current items list to an .xlsx file
  // ---------------------------------------------------------------------------
  const exportToExcel = async () => {
    // load the template binary
    const response = await fetch('/template.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    // use XlsxPopulate to preserve form controls (checkboxes)
    const workbook = await XlsxPopulate.fromDataAsync(arrayBuffer);

    // Named Range Population
    workbook.definedName('Part_Number').value(partInfo.partNumber || '');
    workbook.definedName('Model').value(partInfo.model || '');
    workbook.definedName('Part_Name').value(partInfo.partName || '');
    workbook.definedName('Event').value(partInfo.event || '');
    workbook.definedName('Supplier').value(partInfo.supplier || '');
    workbook.definedName('Facility').value(partInfo.facility || '');
    workbook.definedName('Drawing_Rank').value(partInfo.drawingRank || '');
    workbook.definedName('Regulation_Part').value(partInfo.regulationPart || '');

    // Checkboxes
    workbook.definedName('Regular_Inspection_Box').value(partInfo.dpRegular);
    workbook.definedName('NM_Inspection_Box').value(partInfo.dpNewModel);
    workbook.definedName('Prob_Inv_Box').value(partInfo.dpProblem);
    workbook.definedName('Other_Box').value(partInfo.dpOther);
    console.log(partInfo.dpOther);
    console.log(partInfo.dpOtherText);
    if (partInfo.dpOther) {
      workbook.definedName('Other_Input').value(partInfo.dpOtherText || '');
    };
    workbook.definedName('Side_L_Box').value(partInfo.sideLeft);
    workbook.definedName('Side_R_Box').value(partInfo.sideRight);

    // Data from Tolerance Table
    // Read table header and rows from the DOM
    const table = document.getElementById('items-table');
    const headers = Array.from(table.tHead.rows[0].cells)
      .slice(0, 11) // Skip 'No.' and 'Action' columns
      .map(cell => cell.innerText);

    const domData = Array.from(table.tBodies[0].rows).map(row =>
      Array.from(row.cells)
        .slice(0, 11) // Match the same columns
        .map(cell => cell.innerText)
    );
    
    console.log([headers, domData])
    const headerNames = ['Header_No', 'Header_InspItem', 'Header_TolType', 'Header_CCP', 'Header_Method', 'Header_Sample', 'Header_Reporting', 'Header_LSL', 'Header_USL', 'Header_Nom'];
    const colOrder = [0,1,2,null,null,6,7,8,null,9,null,5,4,null,3];
    const domRearranged = domData.map(row => colOrder.map(colIdx => row[colIdx]));

    workbook.definedName('Table_Start1').value(domRearranged)

    console.log(domRearranged)
    
    // Generate the updated file as a Blob and trigger download
    const blob = await workbook.outputAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'IDS_Populated.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------------------------------------------------------------------
  // Download a blank Excel template
  // ---------------------------------------------------------------------------
  const downloadTemplate = async () => {
    const response = await fetch('/template.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Prepare unique groupIds for rendering the table
  const grouped = Array.from(new Set(items.map(i => i.groupId)));

  // ---------------------------------------------------------------------------
  // Render JSX: Part Details, Add/Edit Item, and Items Table
  // ---------------------------------------------------------------------------
  return (
    <Box p={1}>
      {/* Part Details Section */}
      <Card sx={{ mb: 1 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Part Details
          </Typography>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={1}>
            {/* Part Number + Side checkboxes */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ gridColumn: 1, gridRow: 1 }}>
              <TextField
                size="small"
                label="Part Number"
                name="partNumber"
                value={partInfo.partNumber}
                onChange={handlePartChange}
              />
              <FormControlLabel
                control={<Checkbox size="small" name="sideLeft" checked={partInfo.sideLeft} onChange={handlePartChange} />}
                label="Left"
              />
              <FormControlLabel
                control={<Checkbox size="small" name="sideRight" checked={partInfo.sideRight} onChange={handlePartChange} />}
                label="Right"
              />
            </Stack>

            {/* Model */}
            <TextField
              size="small"
              label="Model"
              name="model"
              value={partInfo.model}
              onChange={handlePartChange}
              sx={{ gridColumn: 2, gridRow: 1 }}
            />

            {/* Part Name */}
            <TextField
              size="small"
              label="Part Name"
              name="partName"
              value={partInfo.partName}
              onChange={handlePartChange}
              sx={{ gridColumn: 1, gridRow: 2 }}
            />

            {/* Event */}
            <TextField
              size="small"
              label="Event"
              name="event"
              value={partInfo.event}
              onChange={handlePartChange}
              sx={{ gridColumn: 2, gridRow: 2 }}
            />

            {/* Supplier */}
            <TextField
              size="small"
              label="Supplier"
              name="supplier"
              value={partInfo.supplier}
              onChange={handlePartChange}
              sx={{ gridColumn: 1, gridRow: 3 }}
            />

            {/* Facility */}
            <TextField
              size="small"
              label="Facility"
              name="facility"
              value={partInfo.facility}
              onChange={handlePartChange}
              sx={{ gridColumn: 2, gridRow: 3 }}
            />

            {/* Drawing Rank dropdown */}
            <FormControl fullWidth size="small" sx={{ gridColumn: 1, gridRow: 4 }}>
              <InputLabel id="drawing-rank-label">Drawing Rank</InputLabel>
              <Select
                labelId="drawing-rank-label"
                name="drawingRank"
                value={partInfo.drawingRank}
                label="Drawing Rank"
                onChange={handlePartChange}
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </Select>
            </FormControl>

            {/* Regulation Part dropdown */}
            <FormControl fullWidth size="small" sx={{ gridColumn: 2, gridRow: 4 }}>
              <InputLabel id="reg-part-label">Regulation Part</InputLabel>
              <Select
                labelId="reg-part-label"
                name="regulationPart"
                value={partInfo.regulationPart}
                label="Regulation Part"
                onChange={handlePartChange}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>

            {/* Data Purpose checkboxes in one row */}
            <Box sx={{ gridColumn: '1 / 3', gridRow: 5 }}>
              <Typography variant="caption">Data Purpose</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <FormControlLabel
                  control={<Checkbox size="small" name="dpRegular" checked={partInfo.dpRegular} onChange={handlePartChange} />}
                  label="Regular"
                />
                <FormControlLabel
                  control={<Checkbox size="small" name="dpNewModel" checked={partInfo.dpNewModel} onChange={handlePartChange} />}
                  label="New Model"
                />
                <FormControlLabel
                  control={<Checkbox size="small" name="dpProblem" checked={partInfo.dpProblem} onChange={handlePartChange} />}
                  label="Problem"
                />
                <FormControlLabel
                  control={<Checkbox size="small" name="dpOther" checked={partInfo.dpOther} onChange={handlePartChange} />}
                  label="Other"
                />
                {partInfo.dpOther && (
                  <TextField
                    size="small"
                    name="dpOtherText"
                    value={partInfo.dpOtherText}
                    onChange={handlePartChange}
                    placeholder="Other Text"
                  />
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------------- */}
      {/* Add/Edit Item Section */}
      {/* ----------------------------------------------------------------------- */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
        <Card sx={{ minWidth: 250 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              {editGroupId ? 'Edit' : 'Add'} Inspection Item
            </Typography>
            <Stack spacing={1}>
              {/* Tolerance Type dropdown
              <FormControl fullWidth size="small">
                <InputLabel id="tol-type-label">Tolerance</InputLabel>
                <Select
                  labelId="tol-type-label"
                  name="toleranceType"
                  value={formValues.toleranceType}
                  label="Tolerance"
                  onChange={handleInputChange}
                  size="small"
                >
                  {toleranceTypes.map(t => (
                    <MenuItem key={t} value={t}>
                      <Typography variant="caption">{t}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}

              <FormControl fullWidth size="small">
                <InputLabel id="tol-type-label">Tolerance</InputLabel>
                <Select
                  labelId="tol-type-label"
                  id="tol-type"
                  name="toleranceType"
                  value={formValues.toleranceType}
                  label="Tolerance"
                  onChange={handleInputChange}
                >
                  {Object.entries(toleranceGroups).map(([group, types]) => [
                    <ListSubheader 
                    key={group}
                    sx={{ fontWeight: 'bold', fontSize: '0.9rem', bgcolor: 'background.paper' }}
                    >{group}
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
                </Select>
              </FormControl>



              {/* Item name and spec inputs */}
              <TextField
                size="small"
                fullWidth
                label="Inspection Item"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
              />
              <FormControl component="fieldset" size="small">
                  <RadioGroup
                    row
                    name="itemType"
                    value={formValues.itemType}
                    onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
                <TextField
                  size="small"
                  label="USL"
                  name="usl"
                  value={formValues.itemType === 'Attribute' ? 'NG' : formValues.usl}
                  onChange={handleInputChange}
                  disabled={formValues.itemType === 'Attribute'}
                />
                <TextField
                  size="small"
                  label="LSL"
                  name="lsl"
                  value={formValues.itemType === 'Attribute' ? 'OK' : formValues.lsl}
                  onChange={handleInputChange}
                  disabled={formValues.itemType === 'Attribute' || isLSLDisabled}
                />
              </Stack>

              {/* Control Plan dropdown */}
              <Tooltip title={<>Mark N/A if the point is not a CCP or KQP <br/><br/>
              CCP and KQP points are identified to ensure visibility of these items is maintained. <br/><br/>
              CCP (Critical Control Point)- These line items are critical points that require variable data and statistical analysis to ensure part performance.  Typically these points are identified by the PACV or are a Q-point.  The supplier can denote an item as critical as well.  Items deemed critical should not be deleted from the IDS at any time.<br/><br/>
              KQP (Key Quality Point)- These line items are key points that ensure part performance, but do not require statistical analysis.  The supplier can denote an item as a KQP as well.  Line items deemed as a KQP should not be deleted from the IDS at any time.<br/><br/>
              GMP (Global Measurement Point)- These line items are global standards across shared models.</>}>
                <FormControl fullWidth size="small">
                <InputLabel id="cp-label">CCP/KQP/GMP</InputLabel>
                <Select
                  labelId="cp-label"
                  name="controlPlan"
                  value={formValues.controlPlan}
                  label="CCP/KQP/GMP"
                  onChange={handleInputChange}
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

              {/* Method, Sample & Frequency, Reporting Frequency */}
              <Tooltip title="What measurement device will take the data?"><TextField
                size="small"
                fullWidth
                label="Method"
                name="method"
                value={formValues.method}
                onChange={handleInputChange}
              /></Tooltip>
              <Tooltip title="How often will data be taken on this line item?"><TextField
                size="small"
                fullWidth
                label="Sample & Freq"
                name="sampleFreq"
                value={formValues.sampleFreq}
                onChange={handleInputChange}
              /></Tooltip>
              <Tooltip title="How often will results be reported to Honda?"><TextField
                size="small"
                fullWidth
                label="Report Freq"
                name="reportingFreq"
                value={formValues.reportingFreq}
                onChange={handleInputChange}
              /></Tooltip>

              {/* Add/Save button */}
              <Button size="small" variant="contained" onClick={handleAddOrUpdate}>
                {editGroupId ? 'Save' : 'Add'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* ----------------------------------------------------------------------- */}
        {/* Export / Template Buttons and Items Table */}
        {/* ----------------------------------------------------------------------- */}
        <Box flex={1}>
          <Stack direction="row" spacing={1} mb={1}>
            <Button size="small" variant="outlined" onClick={exportToExcel}>
              Export IDS
            </Button>
            <Button size="small" variant="outlined" onClick={downloadTemplate}>
              Download Template
            </Button>
          </Stack>
          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
            <Table stickyHeader size="small" id="items-table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 0.5 }}>No.</TableCell>
                  <TableCell sx={{ py: 0.5 }}>Name</TableCell>
                  <TableCell sx={{ py: 0.5 }}>Tol Type</TableCell>
                  <TableCell sx={{ py: 0.5 }}>Nom</TableCell>
                  <TableCell sx={{ py: 0.5 }}>USL</TableCell>
                  <TableCell sx={{ py: 0.5 }}>LSL</TableCell>
                  <TableCell sx={{ py: 0.5 }}>CCP/KQP/GMP</TableCell>
                  <TableCell sx={{ py: 0.5 }}>Method</TableCell>
                  <TableCell sx={{ py: 0.5 }}>Sample</TableCell>
                  <TableCell sx={{ py: 0.5 }}>Report</TableCell>
                  <TableCell sx={{ py: 0.5 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grouped.map((gid, idx) => (
                  <React.Fragment key={gid}>
                    {/* Main row for each item group */}
                    <TableRow hover>
                      <TableCell sx={{ py: 0.5 }}>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 0.5 }}>
                        {items.find(x => x.groupId === gid).name}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 0.5 }}>
                        {items.find(x => x.groupId === gid).toleranceType}
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        {items.find(x => x.groupId === gid).nominal}
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        {items.find(x => x.groupId === gid).usl}
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        {items.find(x => x.groupId === gid).lsl}
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        {items.find(x => x.groupId === gid).controlPlan}
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        {items.find(x => x.groupId === gid).method}
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        {items.find(x => x.groupId === gid).sampleFreq}
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        {items.find(x => x.groupId === gid).reportingFreq}
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        <IconButton size="small" onClick={() => handleEdit(gid)}>
                          <Edit size={14} />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(gid)}>
                          <Delete size={14} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    {/* Subitem rows (e.g., X/Y or Min/Max) */}
                    {items
                      .filter(x => x.groupId === gid && x.subitem)
                      .map((item, j) => (
                        <TableRow hover key={item.id}>
                          <TableCell sx={{ py: 0.5 }}>
                            {`${idx + 1}${String.fromCharCode(97 + j)}`}
                          </TableCell>
                          <TableCell sx={{ py: 0.5 }}>
                            {`${item.name} - ${item.subitem}`}
                          </TableCell>
                          <TableCell sx={{ py: 0.5 }}>{item.toleranceType}</TableCell>
                          {/* Empty cells for grouping visual */}
                          <TableCell sx={{ py: 0.5 }} />
                          <TableCell sx={{ py: 0.5 }} />
                          <TableCell sx={{ py: 0.5 }} />
                          <TableCell sx={{ py: 0.5 }} />
                          <TableCell sx={{ py: 0.5 }} />
                          <TableCell sx={{ py: 0.5 }} />
                          <TableCell sx={{ py: 0.5 }} />
                          <TableCell sx={{ py: 0.5 }} />
                        </TableRow>
                      ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
    </Box>
  );
}
