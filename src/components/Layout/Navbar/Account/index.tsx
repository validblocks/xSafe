import React, { useState, useEffect } from 'react';
import { getIsLoggedIn, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import BoltIcon from '@mui/icons-material/Bolt';
import { Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ConnectedAccount from 'components/Layout/Navbar/ConnectedAccount';
import { MainButton } from 'components/Theme/StyledComponents';
import addressShorthand from 'helpers/addressShorthand';
import Unlock from 'pages/Unlock';
import { ConnectDropdown } from '../navbar-style';

const Account = () => {
  const { address } = useGetAccountInfo();
  const loggedIn = getIsLoggedIn();
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>();
  const intervalRef = React.useRef<any>();
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

  React.useEffect(logoutOnSessionExpire, [isLoggedIn]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="mr-2">
      <Box>
        <MainButton variant="outlined" onClick={handleClick} size="large">
          {loggedIn ? (
            <Box className="d-flex">
              <BoltIcon />
              <Typography>{walletAddress}</Typography>
            </Box>
          ) : (
            <Box className="d-flex">
              <BoltIcon />
              <Typography>Connect</Typography>
            </Box>
          )}
        </MainButton>
      </Box>
      <ConnectDropdown
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        {loggedIn ? (
          <Box sx={{ width: '350px' }}>
            <ConnectedAccount />
          </Box>
        ) : (
          <MenuItem>
            <Unlock />
          </MenuItem>
        )}
      </ConnectDropdown>
    </div>
  );
};

export default Account;
