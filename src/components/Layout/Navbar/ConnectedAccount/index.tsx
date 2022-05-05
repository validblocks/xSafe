import * as React from 'react';
import {
  getIsLoggedIn,
  logout,
  useGetAccountInfo
} from '@elrondnetwork/dapp-core';
import { Ui } from '@elrondnetwork/dapp-utils';
import { faUserCircle, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Safe from 'assets/img/safe.png';
import CopyButton from 'components/CopyButton';
import addressShorthand from 'helpers/addressShorthand';
import { uniqueContractAddress, uniqueContractName } from 'multisigConfig';
import { logoutAction } from 'redux/commonActions';
import { usernameSelector } from 'redux/selectors/accountSelector';
import { routeNames } from 'routes';
import { accessTokenServices } from 'services/accessTokenServices';
import './connectedAccount.scss';

const ConnectedAccount = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector(usernameSelector);
  const { address } = useGetAccountInfo();

  const logOut = async () => {
    document.cookie = '';
    dispatch(logoutAction());
    accessTokenServices?.services?.maiarId?.removeToken?.();
    localStorage.clear();
    sessionStorage.clear();
    logout(routeNames.home, (route) => navigate(route!));
  };
  const onDisconnectClick = () => {
    setIsLoggedIn(false);
    logOut();
  };
  return (
    <Box>
      <Box
        sx={{ mt: 2, mb: 2 }}
        className='d-flex justify-content-center align-items-center'
      >
        <Box>
          <img src={Safe} />
        </Box>
        <Box sx={{ ml: 2 }}>
          <Box
            className='d-flex'
            sx={{ backgroundColor: '#f0f1fd', p: 1, borderRadius: '10px' }}
          >
            <Typography sx={{ mr: 2, ml: 1 }}>{addressShorthand()}</Typography>
            <Box sx={{ mr: 2 }}>
              <CopyButton text={uniqueContractAddress} />
            </Box>
            <Box sx={{ mr: 1 }}>
              <a
                className='explorer-link'
                href={`https://devnet-explorer.elrond.com/accounts/${uniqueContractAddress}`}
                target='_blank'
                rel='noreferrer'
              >
                <ContentPasteSearchIcon />
              </a>
            </Box>
          </Box>
          <Button
            variant='outlined'
            className='btn address-btn btn-light d-flex flex-row align-items-center disconnect-wallet-btn'
            onClick={onDisconnectClick}
            sx={{ margin: 'auto', mt: 2, mb: 2 }}
          >
            <div className='btn-name '>
              <LogoutIcon sx={{ mr: 1 }} />
              <span className='disconnect'>Disconnect Wallet</span>
            </div>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConnectedAccount;
