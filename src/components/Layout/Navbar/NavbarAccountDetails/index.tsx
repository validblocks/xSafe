import React, { useState, useEffect, useCallback } from 'react';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Safe from 'assets/img/safe.png';
import CopyButton from 'components/CopyButton';
import ReceiveModal from 'components/ReceiveModal';
import SafeOptions from 'components/SafeOptions';
import { uniqueContractAddress } from 'multisigConfig';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import './navbarAccountDetails.scss';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import TotalBalance from '../TotalBalance';

const NavbarAccountDetails = ({ uniqueAddress }: { uniqueAddress: string }) => {
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);
  const [showQr, setShowQr] = useState(false);

  const {
    tokenPrices,
    membersCountState: [membersCount]
  } = useOrganizationInfoContext();

  const [openedSafeSelect, setOpenedSafeSelect] = useState(false);

  const handleQrModal = () => {
    setShowQr(!showQr);
  };

  const closeSafeDropdown = (data: boolean) => {
    setOpenedSafeSelect(data);
  };

  return (
    <Box className='navbar-account-details'>
      <Box sx={{ textAlign: 'center' }}>
        <Box>
          <img src={Safe} width='91px' height='91px' />
        </Box>
        <Box>
          <Box className='members-box'>
            <Typography>
              {membersCount} {membersCount == 1 ? 'Member' : 'Members'}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ pt: 1 }}
          className='d-flex justify-content-center align-items-center'
        >
          <Typography align='center'>{uniqueAddress}</Typography>
          {openedSafeSelect === true && (
            <Box>
              <ArrowDropUpIcon
                onClick={() => {
                  setOpenedSafeSelect(false);
                }}
              />
              <SafeOptions closeSafeDropdown={closeSafeDropdown} />
            </Box>
          )}
          {openedSafeSelect === false && (
            <Box>
              <ArrowDropDownIcon
                onClick={() => {
                  setOpenedSafeSelect(true);
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Box className='d-flex justify-content-center' sx={{ pt: 1 }}>
        <Box onClick={handleQrModal} sx={{ mx: 1, cursor: 'pointer' }}>
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
      <Box sx={{ mt: 2 }} className='d-flex justify-content-center'>
        <Box sx={{ px: 2 }} className='read-only-wrapper'>
          <Typography>Read-only</Typography>
        </Box>
      </Box>
      <TotalBalance />
    </Box>
  );
};

export default NavbarAccountDetails;
