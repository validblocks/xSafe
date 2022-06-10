import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { Box, Typography, Modal, Button, Card } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { CSVLink } from 'react-csv';

import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { AddressBook as AddressBookType } from 'pages/Organization/types';
import { addressBookSelector } from 'redux/selectors/addressBookSelector';
import { addEntry } from 'redux/slices/addressBookSlice';
import { RootState } from 'redux/store';

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
let rows = [
  { id: 1, name: 'Snow', address: 'Jon' },
  { id: 2, name: 'Lannister', address: 'Cersei' }
];
const AddressBook = () => {
  const [modalState, setModalState] = useState(false);
  const dispatch = useDispatch();

  const toolbar = () => {
    return (
      <GridToolbarContainer>
        <>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => setModalState(true)}
          >
            Import
          </Button>
          <Button
            startIcon={<UploadIcon />}
            onClick={() => setModalState(true)}
          >
            Export
          </Button>
          <Button startIcon={<AddIcon />} onClick={() => setModalState(true)}>
            Create entry
          </Button>
          <CSVLink data={csvData}>Download me</CSVLink>
        </>
      </GridToolbarContainer>
    );
  };

  const addressBook = useSelector<RootState, AddressBookType>(
    addressBookSelector
  );
  rows = Object.entries(addressBook).map(([key, value], index) => ({
    id: index + 1,
    name: key,
    address: value
  }));

  const validationSchema = Yup.object().shape({
    address: Yup.string().required('Required'),
    name: Yup.string().required('Required')
  });

  const createEntryForm = useFormik({
    initialValues: {
      address: '',
      name: ''
    },
    onSubmit: ({ address, name }) => {
      dispatch(addEntry({ address, name }));
      setModalState(false);
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true
  });

  const csvHeaders = ['Address', 'Name'];
  const csvData = [
    csvHeaders,
    ...Object.entries(addressBook).map(([key, value]) => [key, value])
  ];

  // const { touched, errors, values } = createEntryForm;
  // const { address, name } = values;

  return (
    <div className='container'>
      <Box height='300px' display='flex' flexDirection='column'>
        <DataGrid
          components={{ Toolbar: toolbar }}
          autoHeight
          rows={rows}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
      <Modal
        className='modal-container'
        open={modalState}
        onClose={() => setModalState(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Card>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Text in a modal
          </Typography>
          <form onSubmit={createEntryForm.handleSubmit}>
            <label htmlFor='address'>Address</label>
            <input
              id='address'
              name='address'
              type='text'
              onChange={createEntryForm.handleChange}
              value={createEntryForm.values.address}
            />
            <label htmlFor='name'>Name</label>
            <input
              id='name'
              name='name'
              type='text'
              onChange={createEntryForm.handleChange}
              value={createEntryForm.values.name}
            />
            <button type='submit'>Submit</button>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default AddressBook;
