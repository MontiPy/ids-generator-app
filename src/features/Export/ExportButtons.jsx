// src/features/Export/ExportButtons.jsx
import React from 'react';
import { Button, Stack } from '@mui/material';

export default function ExportButtons({ onExport, onDownload }) {
  return (
    <Stack direction="row" spacing={1} mb={1}>
      <Button onClick={onExport}>Export IDS</Button>
      <Button onClick={onDownload}>Download Template</Button>
    </Stack>
  );
}
