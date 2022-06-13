import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { Box, Button, Card } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { Modal } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { AddressBook as AddressBookType } from 'pages/Organization/types';
import { addressBookSelector } from 'redux/selectors/addressBookSelector';
import { addEntry } from 'redux/slices/addressBookSlice';
import { RootState } from 'redux/store';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';
import NewEntryModal from './NewEntryModal';

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
  const [actionType, setActionType] = useState<string | null>(null);
  const dispatch = useDispatch();

  const toolbar = () => {
    return (
      <GridToolbarContainer>
        <>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => {
              setActionType('import');
              setModalState(true);
            }}
          >
            Import
          </Button>
          <Button
            startIcon={<UploadIcon />}
            onClick={() => {
              setActionType('export');
              setModalState(true);
            }}
          >
            Export
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setActionType('new');
              setModalState(true);
            }}
          >
            Create entry
          </Button>
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
  const importForm = useFormik({
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

  const exportForm = useFormik({
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
        show={modalState}
        size='lg'
        className='modal-container'
        animation={false}
        centered
        onHide={() => {
          setModalState(false);
          setActionType(null);
        }}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <div className='card'>
          <div className='card-body'>
            <div className='modal-control-container'>
              {actionType === 'new' && <NewEntryModal form={createEntryForm} />}
              {actionType === 'export' && (
                <ExportModal
                  handleClose={() => {
                    setModalState(false);
                    setActionType(null);
                  }}
                  addressBook={addressBook}
                />
              )}
              {actionType === 'import' && <ImportModal form={importForm} />}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressBook;
