import React, { useState, useEffect } from 'react';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Safe from 'assets/img/safe.png';
import CopyButton from 'components/CopyButton';
import ReceiveModal from 'components/ReceiveModal';
import { queryBoardMemberAddresses } from 'contracts/MultisigContract';
import { uniqueContractAddress } from 'multisigConfig';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import { setProposeMultiselectSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';
import './navbarAccountDetails.scss';

const NavbarAccountDetails = ({ uniqueAddress }: any) => {
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);
  const [boardMembers, setBoardMembers] = useState([]);

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
    <Box className='navbar-account-details'>
      <Box sx={{ textAlign: 'center' }}>
        <Box>
          <img src={Safe} width='91px' height='91px' />
        </Box>
        <Box>
          <Box className='members-box'>
            <Typography>8 Members</Typography>
          </Box>
        </Box>
        <Box sx={{ pt: 1 }}>
          <Typography align='center'>{uniqueAddress}</Typography>
        </Box>
      </Box>
      <Box className='d-flex justify-content-center' sx={{ pt: 1 }}>
        <Box onClick={handleQrModal} sx={{ mx: 1 }}>
          <QrCode2Icon />
        </Box>
        <Box className={'copy-btn'} sx={{ mx: 1 }}>
          <CopyButton text={uniqueContractAddress} />
        </Box>
        <Box sx={{ mx: 1 }}>
          <a
            href={`https://devnet-explorer.elrond.com/accounts/${uniqueContractAddress}`}
            target='_blank'
            rel='noreferrer'
            className='explorer-link'
          >
            <ContentPasteSearchIcon />
          </a>
        </Box>
        <ReceiveModal
          showQrFromSidebar={showQr}
          address={currentContract?.address}
          handleQr={handleQrModal}
        />
      </Box>
      <Box sx={{ pt: 1 }}>
        <Typography className='text-center'>Total balance:</Typography>
        <h5 className='ex-currency text-center'>199 USD</h5>
      </Box>
      <Box className='d-flex justify-content-center' sx={{ pb: 1 }}>
        <Button
          className='new-transfer-btn'
          variant='outlined'
          onClick={onAddBoardMember}
        >
          <NorthEastRoundedIcon /> New Transfer
        </Button>
      </Box>
    </Box>
  );
};

export default NavbarAccountDetails;
