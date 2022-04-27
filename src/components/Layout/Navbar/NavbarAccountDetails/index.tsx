import React, { useState, useEffect } from 'react';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ReceiveModal from 'components/ReceiveModal';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import { setProposeMultiselectSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';

const NavbarAccountDetails = ({ uniqueAddress, address }: any) => {
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);

  const [showQr, setShowQr] = useState(false);

  const handleQrModal = () => {
    setShowQr(!showQr);
  };

  const onAddBoardMember = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.multiselect_proposal_options
      })
    );
  return (
    <Box>
      <Box
        sx={{
          width: '50px',
          height: '50px',
          backgroundColor: '#000',
          margin: 'auto'
        }}
      ></Box>
      <Box sx={{ pt: 1 }}>
        <Typography align='center'>{uniqueAddress}</Typography>
      </Box>
      <Box className='d-flex justify-content-center' sx={{ pt: 1 }}>
        <Button onClick={handleQrModal}>
          <QrCode2Icon />
        </Button>
        <CopyAllIcon />
        <a
          href={`https://devnet-explorer.elrond.com/accounts/${address}`}
          target='_blank'
          rel='noreferrer'
        >
          <ContentPasteSearchIcon />
        </a>
        <ReceiveModal
          showQrFromSidebar={showQr}
          address={currentContract?.address}
          handleQr={handleQrModal}
        />
      </Box>
      <Box sx={{ pt: 1 }}>
        <h5 className='ex-currency text-center'>199 USD</h5>
      </Box>
      <Box className='d-flex justify-content-center' sx={{ pb: 1 }}>
        <Button variant='contained' onClick={onAddBoardMember}>
          <NorthEastRoundedIcon /> New Transaction
        </Button>
      </Box>
    </Box>
  );
};

export default NavbarAccountDetails;
