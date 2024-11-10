import SearchIcon from '@mui/icons-material/Search';
import { Box, useMediaQuery } from '@mui/material';
import { toSvg } from 'jdenticon';
import { network } from 'src/config';
import { useEffect, useMemo, useState } from 'react';
import CopyButton from 'src/components/Utils/CopyButton';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import * as Styled from '../../../Utils/styled';
import { ConnectItems, AnchorConnectedAccount } from '../navbar-style';
import { LogoutButton } from 'src/components/Utils/LogoutButton';
import { useGetAccountInfo, useGetLoginInfo } from 'src/hooks/sdkDappHooks';

interface Props {
  closeSidebar: () => void;
}

export const MobileConnectedAccount: React.FC<Props> = ({ closeSidebar }) => {
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
      <LogoutButton enableMobileStyle logoutCallback={closeSidebar} />
    </Box>
  );
};
