import { Button, Typography } from '@mui/material';
import { Importer, ImporterField } from 'react-csv-importer';
import 'react-csv-importer/dist/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { addEntry } from 'src/redux/slices/addressBookSlice';

type ImportModalProps = {
  handleClose: () => void;
};

const ImportModal = ({ handleClose }: ImportModalProps) => {
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);
  return (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Text in a modal
      </Typography>
      <Importer
        assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
        restartable={false} // optional, lets user choose to upload another file when import is complete
        processChunk={(rows: any) => {
          rows.forEach((row: any) => {
            dispatch(addEntry({ ...row, contractAddress: currentContract?.address }));
          });
        }}
      >
        <ImporterField name="name" label="Name" />
        <ImporterField name="address" label="Address" />
      </Importer>
      <Button onClick={handleClose}>Cancel</Button>
    </>
  );
};

export default ImportModal;
