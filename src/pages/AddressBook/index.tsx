import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import { Box, Button } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { Modal } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { AddressBook as AddressBookType } from 'pages/Organization/types';
import { addressBookSelector } from '@redux/selectors/addressBookSelector';
import { addEntry, removeEntry } from '@redux/slices/addressBookSlice';
import { RootState } from '@redux/store';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';
import NewEntryModal from './NewEntryModal';

const AddressBook = () => {
  const onRemoveEntry = (address: string) => {
    dispatch(removeEntry({ address }));
  };
  const onEditEntry = (address: string) => {
    setSelectedAddress(address);
    setActionType('new');
    setModalState(true);
  };
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
    },
    {
      field: 'address',
      headerName: 'Address',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Action',
      getActions: (params: any) => [
        <GridActionsCellItem
          key={params.id}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => onRemoveEntry(params.id)}
        />,
        <GridActionsCellItem
          key={params.id}
          icon={<EditIcon />}
          label="Edit Entry"
          onClick={() => onEditEntry(params.id)}
        />,
      ],
    },
  ];

  const [modalState, setModalState] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const dispatch = useDispatch();

  const toolbar = () => (
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

  const addressBook = useSelector<RootState, AddressBookType>(
    addressBookSelector,
  );
  const rows = Object.entries(addressBook).map(([key, value]) => ({
    id: key,
    address: key,
    name: value,
  }));

  const validationSchema = Yup.object().shape({
    address: Yup.string().required('Required'),
    name: Yup.string().required('Required'),
  });

  const createEntryForm = useFormik({
    initialValues: {
      address: '',
      name: '',
    },
    onSubmit: ({ address, name }) => {
      dispatch(addEntry({ address, name }));
      setModalState(false);
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });

  return (
    <div className="container">
      <Box height="300px" display="flex" flexDirection="column">
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
        size="lg"
        className="modal-container"
        animation={false}
        centered
        onHide={() => {
          setSelectedAddress(null);
          setActionType(null);
          setModalState(false);
          createEntryForm.resetForm();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="card">
          <div className="card-body">
            <div className="modal-control-container">
              {actionType === 'new' && (
                <NewEntryModal
                  form={createEntryForm}
                  selectedAddress={selectedAddress}
                  addressBook={addressBook}
                />
              )}
              {actionType === 'export' && (
                <ExportModal
                  handleClose={() => {
                    setModalState(false);
                    setActionType(null);
                  }}
                  addressBook={addressBook}
                />
              )}
              {actionType === 'import' && (
                <ImportModal
                  handleClose={() => {
                    setModalState(false);
                    setActionType(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressBook;
