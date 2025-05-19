// src/features/InspectionItems/ItemsTable.jsx
import React from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Edit, Delete } from "lucide-react";

export default function ItemsTable({ items, onEdit, onDelete }) {
  const grouped = Array.from(new Set(items.map((i) => i.groupId)));

  return (
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
              <TableRow hover>
                <TableCell sx={{ py: 0.5 }}>{idx + 1}</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 0.5 }}>
                  {items.find((x) => x.groupId === gid).name}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 0.5 }}>
                  {items.find((x) => x.groupId === gid).toleranceType}
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  {items.find((x) => x.groupId === gid).nominal}
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  {items.find((x) => x.groupId === gid).usl}
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  {items.find((x) => x.groupId === gid).lsl}
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  {items.find((x) => x.groupId === gid).controlPlan}
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  {items.find((x) => x.groupId === gid).method}
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  {items.find((x) => x.groupId === gid).sampleFreq}
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  {items.find((x) => x.groupId === gid).reportingFreq}
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <IconButton size="small" onClick={() => onEdit(gid)}>
                    <Edit size={14} />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(gid)}>
                    <Delete size={14} />
                  </IconButton>
                </TableCell>
              </TableRow>
              {items
                .filter((x) => x.groupId === gid && x.subitem)
                .map((item, j) => (
                  <TableRow hover key={item.id}>
                    <TableCell sx={{ py: 0.5 }}>{`${
                      idx + 1
                    }${String.fromCharCode(97 + j)}`}</TableCell>
                    <TableCell
                      sx={{ py: 0.5 }}
                    >{`${item.name} - ${item.subitem}`}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{item.toleranceType}</TableCell>
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
  );
}
