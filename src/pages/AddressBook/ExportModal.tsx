import React from 'react';
import BackupIcon from '@mui/icons-material/Backup';
import { Button, Typography } from '@mui/material';
import { CSVLink } from 'react-csv';

type ExportModalProps = {
  handleClose: () => void;
  addressBook: Record<string, string>;
};

const ExportModal = ({ handleClose, addressBook }: ExportModalProps) => {
  const csvHeaders = ['Address', 'Name'];
  const csvData = [
    csvHeaders,
    ...Object.entries(addressBook).map(([key, value]) => [key, value])
  ];

  return (
    <>
      <Typography id='modal-modal-title' variant='h6' component='h2'>
        Export address book
      </Typography>
      <BackupIcon />
      <Typography id='modal-modal-title' variant='h6' component='h2'>
        You are about to export a CSV file with{' '}
        {Object.keys(addressBook).length} address book entries.
      </Typography>
      <CSVLink data={csvData}>Download</CSVLink>
      <Button onClick={handleClose}>Cancel</Button>
    </>
  );
};

export default ExportModal;
