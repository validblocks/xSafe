import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getIsLoggedIn, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import BoltIcon from '@mui/icons-material/Bolt';
import { Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ConnectedAccount from 'src/components/Layout/Navbar/ConnectedAccount';
import { AccountButton } from 'src/components/Theme/StyledComponents';
import Unlock from 'src/pages/Unlock';
import addressShorthand from 'src/helpers/addressShorthand';
import { ConnectDropdown } from '../navbar-style';

function Account() {
  const { address } = useGetAccountInfo();
  const loggedIn = getIsLoggedIn();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  const intervalRef = useRef<any>();
  const logoutOnSessionExpire = () => {
    intervalRef.current = setInterval(() => {
      const loggedIn = getIsLoggedIn();
      if (!loggedIn && isLoggedIn === true) {
        window.location.reload();
      }
      if (loggedIn) {
        setIsLoggedIn(true);
      }
    }, 2000);
    return () => {
      clearInterval(intervalRef.current);
    };
  };

  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    setWalletAddress(addressShorthand(address));
  }, []);

  useEffect(logoutOnSessionExpire, [isLoggedIn]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMainButtonActive, setIsMainButtonActive] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setIsMainButtonActive(true);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsMainButtonActive(false);
  };

  const MAIN_BUTTON_VARIABLE_STYLE = useMemo(
    () => ({}), [isMainButtonActive],
  );

  return (
    <div className="mr-2">
      <Box>
        <AccountButton
          variant="outlined"
          onClick={handleClick}
          size="large"
          className={isMainButtonActive ? 'isActive' : ''}
          sx={{ ...MAIN_BUTTON_VARIABLE_STYLE }}
        >
          {loggedIn ? (
            <Box className="d-flex">
              <BoltIcon />
              <Typography sx={{ textTransform: 'lowercase' }}>{walletAddress}</Typography>
            </Box>
          ) : (
            <Box className="d-flex" sx={{ textTransform: 'capitalize' }}>
              <BoltIcon />
              <Typography>Connect</Typography>
            </Box>
          )}
        </AccountButton>
      </Box>
      <ConnectDropdown
        anchorEl={anchorEl}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            boxShadow: '0px 8px 24px rgba(76, 47, 252, 0.13)',
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
