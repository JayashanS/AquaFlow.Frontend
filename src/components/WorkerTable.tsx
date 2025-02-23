import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TablePagination,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { HandleWorkerFilterChangeProps } from "../interfaces/worker";

export interface Worker {
  id: number;
  name: string;
  age: number;
  email: string;
  positionId: number;
  certifiedUntil: string;
  fishFarmId: number;
  pictureUrl: string;
}

interface WorkerTableProps {
  workers: Worker[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onFilterChange: (params: HandleWorkerFilterChangeProps) => void;

  onDelete: (id: number) => void;
}

const WorkerTable: React.FC<WorkerTableProps> = ({
  workers,
  totalCount,
  page,
  rowsPerPage,
  onFilterChange,

  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      onDelete(selectedId);
    }
    setOpen(false);
    setSelectedId(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    onFilterChange({ name: "pageNumber", value: newPage + 1 });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFilterChange({
      name: "pageSize",
      value: parseInt(event.target.value, 10),
    });
    onFilterChange({ name: "pageNumber", value: 1 });
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: "80vh", overflow: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Picture</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Certified Until</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workers.map((worker) => (
            <TableRow key={worker.id}>
              <TableCell>
                <img
                  src={`http://localhost:5082/${worker.pictureUrl}`}
                  alt={worker.name}
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                />
              </TableCell>
              <TableCell>{worker.name}</TableCell>
              <TableCell>{worker.age}</TableCell>
              <TableCell>{worker.email}</TableCell>
              <TableCell>{worker.certifiedUntil}</TableCell>
              <TableCell>
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteClick(worker.id)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this worker?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default WorkerTable;
