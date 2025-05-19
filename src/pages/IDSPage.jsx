// src/pages/IDSPage.jsx
import React, { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import PartDetailsForm from "../features/PartDetails/PartDetailsForm";
import ItemForm from "../features/InspectionItems/ItemForm";
import ItemsTable from "../features/InspectionItems/ItemsTable";
import useGroupedItems from "../features/InspectionItems/useGroupedItems";
import {
  exportToExcel,
  downloadTemplate,
} from "../features/Export/excelExporter";
import ExportButtons from "../features/Export/ExportButtons";
import {
  toleranceGroups,
  toleranceIcons,
  controlPlans,
  nonLSLTolerances,
  tolWithXY,
  tolWithMinMax,
} from "../constants/tolerance";

export default function IDSPage() {
  const [partInfo, setPartInfo] = useState({
    partNumber: "",
    partName: "",
    supplier: "",
    model: "",
    event: "",
    facility: "",
    drawingRank: "",
    regulationPart: "",
    sideLeft: false,
    sideRight: false,
    dpRegular: false,
    dpNewModel: false,
    dpProblem: false,
    dpOther: false,
    dpOtherText: "",
  });

  const [formValues, setFormValues] = useState({
    name: "",
    toleranceType: "",
    itemType: "Variable",
    nominal: "",
    usl: "",
    lsl: "",
    controlPlan: "N/A",
    method: "",
    sampleFreq: "",
    reportingFreq: "",
  });

  const isLSLDisabled = nonLSLTolerances.includes(formValues.toleranceType);

  useEffect(() => {
    if (isLSLDisabled) {
      setFormValues((prev) => ({ ...prev, lsl: "n/a" }));
    }
  }, [isLSLDisabled, formValues.toleranceType]);

  const resetFormValues = () => {
    setFormValues({
      name: "",
      toleranceType: "",
      itemType: "Variable",
      nominal: "",
      usl: "",
      lsl: "",
      controlPlan: "N/A",
      method: "",
      sampleFreq: "",
      reportingFreq: "",
    });
  };

  const handlePartChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPartInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const { items, editGroupId, handleAddOrUpdate, handleEdit, handleDelete } =
    useGroupedItems();

  return (
    <Box p={1}>
      <PartDetailsForm partInfo={partInfo} onChange={handlePartChange} />

      <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
        <Box minWidth={250}>
          <ItemForm
            formValues={formValues}
            onChange={(e) => {
              const { name, value } = e.target;
              setFormValues((prev) => ({ ...prev, [name]: value }));
            }}
            onSubmit={() =>
              handleAddOrUpdate(
                formValues,
                tolWithXY,
                tolWithMinMax,
                resetFormValues
              )
            }
            isEdit={Boolean(editGroupId)}
            isLSLDisabled={isLSLDisabled}
            toleranceGroups={toleranceGroups}
            toleranceIcons={toleranceIcons}
            controlPlans={controlPlans}
          />
        </Box>

        <Box flex={1}>
          <ExportButtons
            onExport={() => exportToExcel(partInfo, items)}
            onDownload={downloadTemplate}
          />

          <ItemsTable
            items={items}
            onEdit={(gid) => handleEdit(gid, setFormValues)}
            onDelete={(gid) => handleDelete(gid, resetFormValues)}
          />
        </Box>
      </Stack>
    </Box>
  );
}
