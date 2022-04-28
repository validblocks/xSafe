import React, { useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Box, Button, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import CopyButton from 'components/CopyButton';
import DrawerAccounts from 'components/Layout/Navbar/DrawerAccounts';
import ReceiveModal from 'components/ReceiveModal';
import { uniqueContractAddress } from 'multisigConfig';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import { setProposeMultiselectSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';

const NavbarAccountDetails = ({ uniqueAddress, address }: any) => {
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);
  const [open, setOpen] = React.useState(false);
  const drawerWidth = 340;

  const [showQr, setShowQr] = useState(false);
  const theme = useTheme();

  const handleQrModal = () => {
    setShowQr(!showQr);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  }));

  const onAddBoardMember = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.multiselect_proposal_options
      })
    );
  const addSafe = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.add_proposer
      })
    );

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  return (
    <Box>
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
        {!uniqueContractAddress && (
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              mr: 2,
              position: 'absolute',
              top: '8px',
              right: '0px',
              ...(open && { display: 'none' })
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <Box
            sx={{ mt: 12, width: '100%' }}
            className='d-flex align-items-center justify-content-between'
          >
            <Box className='d-flex'>
              <Button className='align-items-start' onClick={addSafe}>
                <AddCircleIcon />
                <p>Add Safe</p>
              </Button>
            </Box>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </Box>
        </DrawerHeader>
        <DrawerAccounts />
      </Drawer>
      <Box className='d-flex justify-content-center' sx={{ pt: 1 }}>
        <Box onClick={handleQrModal} sx={{ mx: 1 }}>
          <QrCode2Icon />
        </Box>
        <Box className={'copy-btn'} sx={{ mx: 1 }}>
          <CopyButton text={address} />
        </Box>
        <Box sx={{ mx: 1 }}>
          <a
            href={`https://devnet-explorer.elrond.com/accounts/${address}`}
            target='_blank'
            rel='noreferrer'
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
