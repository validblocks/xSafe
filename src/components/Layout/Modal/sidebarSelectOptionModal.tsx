import React from 'react';
import DiamondIcon from '@mui/icons-material/Diamond';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import {
  Box, Button, Modal, Grid,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { setProposeModalSelectedOption } from '@redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '0.25rem',
  boxShadow: 24,
  p: 4,
};

const SidebarSelectOptionModal = () => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();

  const sendFunds = () => {
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.send_token,
      }),
    );
    setOpen(false);
  };

  const sendNft = () => {
    console.log('sendNft');
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p className="h3 mb-spacer" data-testid="delegateTitle">
            Send
          </p>
          <Grid sx={{ textAlign: 'center' }}>
            <Box className="card select-options-list modal-action-btns">
              <Button
                variant="contained"
                className="selectable-option btn btn-primary btn-light"
                onClick={sendFunds}
              >
                <PaidOutlinedIcon sx={{ pr: 1 }} />
                Send Funds
              </Button>
            </Box>
            <Box className="card select-options-list modal-action-btns">
              <Button
                variant="contained"
                className="selectable-option btn btn-primary btn-light"
                onClick={sendNft}
              >
                <DiamondIcon sx={{ pr: 1 }} />
                Send NFT
              </Button>
            </Box>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default SidebarSelectOptionModal;
