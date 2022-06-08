import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true
  },
  {
    field: 'address',
    headerName: 'Address',
    width: 150,
    editable: true
  }
];
const rows = [
  { name: 'Snow', address: 'Jon' },
  { name: 'Lannister', address: 'Cersei' }
];

const AddressBook = () => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      checkboxSelection
      disableSelectionOnClick
    />
  );
};

export default AddressBook;
