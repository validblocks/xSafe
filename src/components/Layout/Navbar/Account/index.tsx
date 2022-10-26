import { useState, useEffect, useMemo, useRef } from 'react';
import { getIsLoggedIn, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import BoltIcon from '@mui/icons-material/Bolt';
import { Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTheme } from 'styled-components';
import ConnectedAccount from 'src/components/Layout/Navbar/ConnectedAccount';
import { AccountButton } from 'src/components/Theme/StyledComponents';
import Unlock from 'src/pages/Unlock';
import addressShorthand from 'src/helpers/addressShorthand';
import { useDispatch, useSelector } from 'react-redux';
import { isLoginModalOpenSelector } from 'src/redux/selectors/modalsSelector';
import { setIsLoginModalOpen } from 'src/redux/slices/modalsSlice';
import { ConnectDropdown } from '../navbar-style';

function Account() {
  const theme: any = useTheme();
  const { address } = useGetAccountInfo();
  const loggedIn = getIsLoggedIn();
  const [isLoggedIn] = useState<boolean>();
  const accountButtonRef = useRef<HTMLButtonElement | null>(null);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    setWalletAddress(addressShorthand(address));
  }, [isLoggedIn, address]);

  const [isMainButtonActive, setIsMainButtonActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isLoginModalOpen = useSelector(isLoginModalOpenSelector);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setIsMainButtonActive(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMainButtonActive(false);
    dispatch(setIsLoginModalOpen(false));
  };

  useEffect(() => {
    if (isLoginModalOpen) {
      accountButtonRef.current?.click();
      return;
    }

    handleClose();
  }, [isLoginModalOpen]);

  const MAIN_BUTTON_VARIABLE_STYLE = useMemo(
    () => ({
      backgroundColor: isMainButtonActive ? '#4C2FFC !important' : '',
      color: isMainButtonActive ? '#FFFF !important' : '',
    }), [isMainButtonActive],
  );

  return (
    <div className="mr-2">
      <Box>
        <AccountButton
          variant="outlined"
          onClick={handleClick}
          size="large"
          ref={accountButtonRef}
          className={isMainButtonActive ? 'isActive' : ''}
          sx={{ ...MAIN_BUTTON_VARIABLE_STYLE }}
        >
          <Box className="d-flex">
            <BoltIcon />
            <Typography sx={{ textTransform: loggedIn ? 'lowercase' : 'none' }}>
              {loggedIn ? walletAddress : 'Connect'}
            </Typography>
          </Box>
        </AccountButton>
      </Box>
      <ConnectDropdown
        anchorEl={anchorEl}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            boxShadow: '0px 8px 24px rgba(76, 47, 252, 0.13)',
            backgroundColor: theme.palette.background.secondary,
          },
        }}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        {loggedIn ? (
          <Box sx={{ width: '350px' }}>
            <ConnectedAccount />
          </Box>
        ) : (
          <MenuItem
            sx={{
              padding: '0',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Unlock />
          </MenuItem>
        )}
      </ConnectDropdown>
    </div>
  );
}

export default Account;
