/* eslint-disable no-nested-ternary */
import { logout } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, useMediaQuery } from '@mui/material';
import { toSvg } from 'jdenticon';
import { network } from 'src/config';
import { useEffect, useMemo, useState } from 'react';
import CopyButton from 'src/components/Utils/CopyButton';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { setCurrentMultisigContract } from 'src/redux/slices/multisigContractsSlice';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { TokenTransfer } from '@multiversx/sdk-core/out';
import {
  setMultisigBalance,
  setOrganizationTokens,
  setTokenTableRows,
} from 'src/redux/slices/accountGeneralInfoSlice';
import { useDispatch } from 'react-redux';
import * as Styled from '../../../Utils/styled';
import {
  ConnectItems,
  DisconnectButton,
  AnchorConnectedAccount,
} from '../navbar-style';

interface Props {
  closeSidebar: () => void;
}

export const MobileConnectedAccount: React.FC<Props> = ({ closeSidebar }) => {
  const dispatch = useDispatch();
  const logOut = async () => {
    // document.cookie = '';
    closeSidebar();
    localStorage.clear();
    sessionStorage.clear();
    dispatch(setCurrentMultisigContract(''));
    dispatch(setProposeModalSelectedOption(null));
    dispatch(
      setMultisigBalance(
        JSON.stringify(TokenTransfer.egldFromAmount('0').amount.toString()),
      ),
    );
    dispatch(setTokenTableRows([]));
    dispatch(setOrganizationTokens([]));
    dispatch(setCurrentMultisigContract(''));
    logout(`${window.location.origin}/multisig`);
  };

  const onDisconnectClick = () => {
    logOut();
  };
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();

  const [walletAddress, setWalletAddress] = useState('');
  const minWidth380 = useMediaQuery('(min-width:380px)');
  const minWidth480 = useMediaQuery('(min-width:480px)');
  const minWidth420 = useMediaQuery('(min-width:420px)');
  const minWidth535 = useMediaQuery('(min-width:535px)');

  const addressChars = useMemo(() => {
    if (minWidth535) return 20;
    if (minWidth480) return 15;
    if (minWidth380) return 10;
    return 7;
  }, [minWidth380, minWidth480, minWidth535]);

  useEffect(() => {
    // eslint-disable-next-line no-nested-ternary
    setWalletAddress(truncateInTheMiddle(address, addressChars));
  }, [address, addressChars, isLoggedIn, minWidth420, minWidth480]);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box
        sx={{ borderRadius: '10px', overflow: 'hidden', minWidth: 38 }}
        dangerouslySetInnerHTML={{
          __html: toSvg(address, 38, { padding: 0 }),
        }}
      />
      <Box className="d-flex justify-content-between" px={1} flexGrow={1}>
        <ConnectItems
          className="d-flex justify-content-between w-100"
          sx={{ p: 1 }}
        >
          {walletAddress}
          <Box className="d-flex">
            <Box flex={4} sx={{ mr: 1 }}>
              <CopyButton
                text={address}
                link={Styled.CopyIconLinkConnectedAccount}
              />
            </Box>
            <Box sx={{ mr: 1 }}>
              <AnchorConnectedAccount
                href={`${network.explorerAddress}/accounts/${address}`}
                target="_blank"
                rel="noreferrer"
              >
                <SearchIcon />
              </AnchorConnectedAccount>
            </Box>
          </Box>
        </ConnectItems>
      </Box>
      <DisconnectButton
        variant="outlined"
        onClick={onDisconnectClick}
        sx={{
          padding: '5px 0 !important',
          top: '0 !important',
          minWidth: 38,
          boxSizing: 'border-box',
          width: '38px !important',
          height: '38px !important',
        }}
      >
        <LogoutIcon />
      </DisconnectButton>
    </Box>
  );
};
