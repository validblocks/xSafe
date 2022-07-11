import React, { useState, useEffect, useMemo } from 'react';
import { getIsLoggedIn, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import BoltIcon from '@mui/icons-material/Bolt';
import { Box, Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Union } from 'assets/img/Union.svg';
import ConnectedAccount from 'components/Layout/Navbar/ConnectedAccount';
import { MainButton } from 'components/Theme/StyledComponents';
import addressShorthand from 'helpers/addressShorthand';
import Unlock from 'pages/Unlock';
import { routeNames } from 'routes';
import { ConnectDropdown } from '../navbar-style';

const Account = () => {
  const { address } = useGetAccountInfo();
  const loggedIn = getIsLoggedIn();
  const isOnUnlockPage = window.location.pathname.includes(routeNames.unlock);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    setIsMainButtonActive(true);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsMainButtonActive(false);
  };
  const [isMainButtonActive, setIsMainButtonActive] = useState(false);

  const MAIN_BUTTON_DEFAULT_STYLE = useMemo(
    () => ({
      pr: 1.7,
      pl: 1,
      py: 1.2
    }),
    []
  );
  const MAIN_BUTTON_VARIABLE_STYLE = useMemo(
    () => ({
      backgroundColor: isMainButtonActive ? '#4C2FFC !important' : '',
      color: isMainButtonActive ? '#FFFF !important' : ''
    }),
    [isMainButtonActive]
  );
  return (
    <div className='mr-2'>
      <Box>
        <MainButton
          variant='outlined'
          onClick={handleClick}
          size='large'
          sx={{ ...MAIN_BUTTON_DEFAULT_STYLE, ...MAIN_BUTTON_VARIABLE_STYLE }}
        >
          {loggedIn ? (
            <Box className='d-flex'>
              <BoltIcon />
              <Typography>{walletAddress}</Typography>
            </Box>
          ) : (
            <Box className='d-flex' sx={{ textTransform: 'capitalize' }}>
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
