// src/features/Export/ExportButtons.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Stack, CircularProgress } from '@mui/material';

function ExportButtons({ onExport, onDownload, loading = false }) {
  return (
    <Stack direction="row" spacing={1} mb={1}>
      <Button
        onClick={onExport}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} /> : null}
      >
        {loading ? 'Exporting...' : 'Export IDS'}
      </Button>
      <Button
        onClick={onDownload}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} /> : null}
      >
        {loading ? 'Downloading...' : 'Download Template'}
      </Button>
    </Stack>
  );
}

ExportButtons.propTypes = {
  onExport: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ExportButtons;
