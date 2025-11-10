// src/pages/IDSPage.jsx
import React, { useState } from 'react';
import { Box, Stack, Alert, Snackbar } from '@mui/material';
import PartDetailsForm from '../features/PartDetails/PartDetailsForm';
import ItemForm from '../features/InspectionItems/ItemForm';
import ItemsTable from '../features/InspectionItems/ItemsTable';
import useGroupedItems from '../features/InspectionItems/useGroupedItems';
import { usePartDetails } from '../hooks/usePartDetails';
import { useInspectionItems } from '../hooks/useInspectionItems';
import { exportToExcel, downloadTemplate } from '../features/Export/excelExporter';
import ExportButtons from '../features/Export/ExportButtons';
import ErrorBoundary from '../components/ErrorBoundary';
import {
  toleranceGroups,
  toleranceIcons,
  controlPlans,
  tolWithXY,
  tolWithMinMax,
} from '../constants/tolerance';

export default function IDSPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { partInfo, partErrors, handlePartChange, validatePart } = usePartDetails();
  const {
    formValues,
    setFormValues,
    itemErrors,
    isLSLDisabled,
    resetFormValues,
    handleFormChange,
    validateItems,
  } = useInspectionItems();

  const { items, editGroupId, handleAddOrUpdate, handleEdit, handleDelete, handleDuplicate } =
    useGroupedItems();

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setSnackbarOpen(true);
  };

  const handleExport = async () => {
    if (!validatePart()) {
      return;
    }

    try {
      await exportToExcel(partInfo, items, setLoading, handleError);
    } catch (err) {
      // Error already handled by exportToExcel
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate(setLoading, handleError);
    } catch (err) {
      // Error already handled by downloadTemplate
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setError('');
  };

  return (
    <ErrorBoundary>
      <Box p={1}>
        <PartDetailsForm partInfo={partInfo} onChange={handlePartChange} errors={partErrors} />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
          <Box minWidth={250}>
            <ItemForm
              formValues={formValues}
              onChange={handleFormChange}
              onSubmit={() => {
                if (!validateItems()) {
                  return;
                }
                handleAddOrUpdate(formValues, tolWithXY, tolWithMinMax, resetFormValues);
              }}
              isEdit={Boolean(editGroupId)}
              isLSLDisabled={isLSLDisabled}
              toleranceGroups={toleranceGroups}
              toleranceIcons={toleranceIcons}
              controlPlans={controlPlans}
              errors={itemErrors}
            />
          </Box>

          <Box flex={1}>
            <ExportButtons
              onExport={handleExport}
              onDownload={handleDownloadTemplate}
              loading={loading}
            />

            <ItemsTable
              items={items}
              onEdit={(gid) => handleEdit(gid, setFormValues)}
              onDuplicate={handleDuplicate}
              onDelete={(gid) => handleDelete(gid, resetFormValues)}
            />
          </Box>
        </Stack>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ErrorBoundary>
  );
}
