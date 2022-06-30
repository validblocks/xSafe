import React, { useState, useEffect, useCallback } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import Safe from 'assets/img/safe.png';
import CopyButton from 'components/CopyButton';
import ReceiveModal from 'components/ReceiveModal';
import SafeOptions from 'components/SafeOptions';
import { uniqueContractAddress } from 'multisigConfig';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import { Anchor, ReadOnly, MembersBox } from '../navbar-style';
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
    <Box>
      <Grid
        container
        spacing={1}
        sx={{ mt: 1 }}
        justifyContent='center'
        alignItems='center'
        padding='0px'
        textAlign='center'
      >
        <Grid position='relative' sm={3}>
          <Box display='table'>
            <img src={Safe} width='60px' height='60px' />
          </Box>
          <Box position='absolute' top='-1.4rem' left='-.5rem'>
            <MembersBox borderRadius='.2rem !important'>
              <Typography>{membersCount}</Typography>
            </MembersBox>
          </Box>
        </Grid>
        <Grid sx={{ pl: 0 }}>
          <Box
            sx={{ ml: 0.5 }}
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <Box
              onClick={handleQrModal}
              sx={{
                mr: 1.4,
                ml: 0.2,
                cursor: 'pointer'
              }}
            >
              <QrCode2Icon />
            </Box>
            <Box sx={{ mr: 1.4 }}>
              <CopyButton text={uniqueContractAddress} />
            </Box>
            <Box>
              <Anchor
                href={`https://devnet-explorer.elrond.com/accounts/${uniqueContractAddress}`}
                target='_blank'
                rel='noreferrer'
                color='#6c757d'
              >
                <ContentPasteSearchIcon />
              </Anchor>
            </Box>
          </Box>
          <ReceiveModal
            showQrFromSidebar={showQr}
            address={currentContract?.address}
            handleQr={handleQrModal}
          />
        </Grid>
        <Grid sx={{ mt: 1.2, mb: 1.1 }} sm={8}>
          <ReadOnly borderRadius='.4rem !important' sx={{ px: 2 }}>
            Read-only
          </ReadOnly>
        </Grid>
      </Grid>
      <hr />
      <TotalBalance />
    </Box>
  );
};

export default NavbarAccountDetails;
