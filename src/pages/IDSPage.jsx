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

  const [partErrors, setPartErrors] = useState({});

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

  const [itemErrors, setItemErrors] = useState({});

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
    setPartErrors((prev) => {
      const newErr = { ...prev };
      if (name === "sideLeft" || name === "sideRight") {
        newErr.side = false;
      } else if (name.startsWith("dp")) {
        newErr.dp = false;
        if (name === "dpOtherText") {
          newErr.dpOtherText = false;
        }
      } else {
        newErr[name] = false;
      }
      return newErr;
    });
  };

  const { items, editGroupId, handleAddOrUpdate, handleEdit, handleDelete } =
    useGroupedItems();

  const validatePartDetails = (info) => {
    const errors = {};
    const required = [
      "partNumber",
      "model",
      "partName",
      "event",
      "supplier",
      "facility",
      "drawingRank",
      "regulationPart",
    ];
    required.forEach((f) => {
      if (!info[f] || info[f].toString().trim() === "") {
        errors[f] = true;
      }
    });
    if (!info.sideLeft && !info.sideRight) errors.side = true;
    if (!info.dpRegular && !info.dpNewModel && !info.dpProblem && !info.dpOther)
      errors.dp = true;
    if (info.dpOther && info.dpOtherText.trim() === "") errors.dpOtherText = true;
    return errors;
  };

  const validateItemFields = (values) => {
    const errors = {};
    const required = [
      "toleranceType",
      "name",
      "nominal",
      "usl",
      "controlPlan",
      "method",
      "sampleFreq",
      "reportingFreq",
    ];
    required.forEach((f) => {
      if (!values[f] || values[f].toString().trim() === "") {
        errors[f] = true;
      }
    });
    const lslNeeded =
      values.itemType !== "Attribute" &&
      !nonLSLTolerances.includes(values.toleranceType);
    if (lslNeeded && (!values.lsl || values.lsl.toString().trim() === "")) {
      errors.lsl = true;
    }
    if (
      values.toleranceType === "Other" &&
      (!values.customToleranceType || values.customToleranceType.trim() === "")
    ) {
      errors.customToleranceType = true;
    }
    return errors;
  };

  const handleExport = () => {
    const errs = validatePartDetails(partInfo);
    if (Object.keys(errs).length) {
      setPartErrors(errs);
      return;
    }
    setPartErrors({});
    exportToExcel(partInfo, items);
  };

  return (
    <Box p={1}>
      <PartDetailsForm
        partInfo={partInfo}
        onChange={handlePartChange}
        errors={partErrors}
      />

      <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
        <Box minWidth={250}>
          <ItemForm
            formValues={formValues}
            onChange={(e) => {
              const { name, value } = e.target;
              setFormValues((prev) => ({ ...prev, [name]: value }));
              setItemErrors((prev) => ({ ...prev, [name]: false }));
            }}
            onSubmit={() => {
              const errs = validateItemFields(formValues);
              if (Object.keys(errs).length) {
                setItemErrors(errs);
                return;
              }
              setItemErrors({});
              handleAddOrUpdate(
                formValues,
                tolWithXY,
                tolWithMinMax,
                resetFormValues
              );
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
