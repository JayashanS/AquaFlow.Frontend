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
  Avatar,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Worker, WorkerTableProps } from "../interfaces/worker";
import WorkerEditForm from "./WorkerEditForm";

const WorkerTable: React.FC<WorkerTableProps> = ({
  workers,
  totalCount,
  page,
  rowsPerPage,
  onFilterChange,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
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

  const handleEditClick = (worker: Worker) => {
    setSelectedWorker(worker);
    setOpenEditor(true);
  };

  const onEditorClose = () => {
    setOpenEditor(false);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ height: "80vh", overflow: "auto", paddingBottom: "20px" }}
      elevation={0}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Picture</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="center">Age</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Fish Farm</TableCell>
            <TableCell align="center">Position</TableCell>
            <TableCell align="center">Certified Until</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workers.map((worker) => (
            <TableRow key={worker.id} sx={{ height: "40px" }}>
              <TableCell align="center" sx={{ padding: "4px" }}>
                <Avatar
                  alt={worker.name}
                  src={`http://localhost:5082/${worker.pictureUrl}`}
                />
              </TableCell>
              <TableCell sx={{ padding: "4px" }}>{worker.name}</TableCell>
              <TableCell align="center" sx={{ padding: "4px" }}>
                {worker.age}
              </TableCell>
              <TableCell align="center" sx={{ padding: "4px" }}>
                {worker.email}
              </TableCell>
              <TableCell align="center" sx={{ padding: "4px" }}>
                {worker.fishFarmName}
              </TableCell>
              <TableCell align="center" sx={{ padding: "4px" }}>
                {worker.positionName}
              </TableCell>
              <TableCell align="center" sx={{ padding: "4px" }}>
                {worker.certifiedUntil.split("T")[0]}
              </TableCell>
              <TableCell align="center" sx={{ padding: "4px" }}>
                <IconButton
                  color="primary"
                  onClick={() => handleEditClick(worker)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  sx={{ color: "#f7347f" }}
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
      <WorkerEditForm
        open={openEditor}
        onClose={onEditorClose}
        worker={selectedWorker}
      />
    </TableContainer>
  );
};

export default WorkerTable;
