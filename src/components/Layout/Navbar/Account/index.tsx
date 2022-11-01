import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { useGetAccountInfo, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import BoltIcon from '@mui/icons-material/Bolt';
import { Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTheme } from 'styled-components';
import { AccountButton } from 'src/components/Theme/StyledComponents';
import Unlock from 'src/pages/Unlock';
import addressShorthand from 'src/helpers/addressShorthand';
import { useDispatch, useSelector } from 'react-redux';
import { isLoginModalOpenSelector } from 'src/redux/selectors/modalsSelector';
import { setIsLoginModalOpen } from 'src/redux/slices/modalsSlice';
import { usePrevious } from 'src/utils/usePrevious';
import { ConnectDropdown } from '../navbar-style';
import ConnectedAccount from '../ConnectedAccount';

function Account() {
  const theme: any = useTheme();
  const { address } = useGetAccountInfo();
  const { isLoggedIn, loginMethod } = useGetLoginInfo();
  const accountButtonRef = useRef<HTMLButtonElement | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [dropdownOpacity, setDropdownOpacity] = useState(1);

  useEffect(() => {
    setWalletAddress(addressShorthand(address));
  }, [isLoggedIn, address]);

  const [isMainButtonActive, setIsMainButtonActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isLoginModalOpen = useSelector<boolean>(isLoginModalOpenSelector);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const wasLoggedIn = usePrevious(isLoggedIn, false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setDropdownOpacity(1);
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

  useEffect(() => {
    if (!wasLoggedIn && loginMethod) {
      handleClose();
    }
  }, [loginMethod, wasLoggedIn]);

  const MAIN_BUTTON_VARIABLE_STYLE = useMemo(
    () => ({
      backgroundColor: isMainButtonActive ? '#4C2FFC !important' : '',
      color: isMainButtonActive ? '#FFFF !important' : '',
    }), [isMainButtonActive],
  );

  useLayoutEffect(() => {
    if (dropdownOpacity === 0) {
      setIsMainButtonActive(false);
      const dialogDiv = document.querySelector('div[role=dialog]');
      const ledgerDiv = document.querySelector('div.ledger-login');
      if (dialogDiv && !ledgerDiv) {
        dialogDiv.addEventListener('blur', () => {
          handleClose();
        });
      }
      if (ledgerDiv) {
        ledgerDiv.addEventListener('blur', () => {
          setTimeout(() => {
            const ledgerDivLater = document.querySelector('div.ledger-login');
            if (!ledgerDivLater) { handleClose(); }
          }, 300);
        });
      }
    }
  }, [dropdownOpacity]);

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
            <Typography sx={{ textTransform: isLoggedIn ? 'lowercase' : 'none' }}>
              {isLoggedIn ? walletAddress : 'Connect'}
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
            backgroundColor: theme.palette.background.safeOptions.main,
          },
        }}
        open={open}
        sx={{
          height: dropdownOpacity === 0 ? '0' : 'auto',
          opacity: dropdownOpacity,
          overflow: dropdownOpacity === 0 ? 'hidden' : 'auto',
        }}
        onClose={handleClose}
        onClick={() => {
          setDropdownOpacity(0);
        }}
      >
        {isLoggedIn ? (
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
