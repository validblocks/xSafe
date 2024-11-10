import SearchIcon from '@mui/icons-material/Search';
import { Box, useMediaQuery } from '@mui/material';
import { toSvg } from 'jdenticon';
import { network } from 'src/config';
import { useEffect, useState } from 'react';
import CopyButton from 'src/components/Utils/CopyButton';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import * as Styled from '../../../Utils/styled';
import * as StyledLocal from './Styled/index';
import { ConnectItems, AnchorConnectedAccount } from '../navbar-style';
import { LogoutButton } from 'src/components/Utils/LogoutButton';
import { useGetAccountInfo, useGetLoginInfo } from 'src/hooks/sdkDappHooks';

const ConnectedAccount = () => {
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();

  const [walletAddress, setWalletAddress] = useState('');
  const minWidth497 = useMediaQuery('(min-width:497px)');
  const minWidth420 = useMediaQuery('(min-width:420px)');

  useEffect(() => {
    // eslint-disable-next-line no-nested-ternary
    setWalletAddress(
      truncateInTheMiddle(address, minWidth497 ? 12 : minWidth420 ? 9 : 13),
    );
  }, [address, isLoggedIn, minWidth420, minWidth497]);

  return (
    <Box>
      <Box display="flex">
        <Box>
          <Box
            sx={{ borderRadius: '10px', overflow: 'hidden' }}
            dangerouslySetInnerHTML={{
              __html: toSvg(address, minWidth420 ? 98 : 165, { padding: 0 }),
            }}
          />
        </Box>
        <StyledLocal.ConnectedAccountDetailsContainer>
          <Box>
            <ConnectItems
              className="d-flex justify-content-between"
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
          <Box>
            <LogoutButton />
          </Box>
        </StyledLocal.ConnectedAccountDetailsContainer>
      </Box>
    </Box>
  );
};

export default ConnectedAccount;
