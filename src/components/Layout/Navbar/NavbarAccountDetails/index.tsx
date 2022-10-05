import React, { useCallback, useEffect, useState, useRef } from 'react';
import ContentPasteGoOutlinedIcon from '@mui/icons-material/ContentPasteGoOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import {
  Box, Typography, Grid,
} from '@mui/material';
import Grow from '@mui/material/Grow';
import { useSelector } from 'react-redux';
import Safe from 'src/assets/img/safe.png';
import CopyButton from 'src/components/CopyButton';
import ReceiveModal from 'src/components/ReceiveModal';
import SafeOptions from 'src/components/SafeOptions';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { network } from 'src/config';
import { safeNameStoredSelector } from 'src/redux/selectors/safeNameSelector';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import {
  Anchor, MembersBox, ReadOnly,
} from '../navbar-style';
import TotalBalance from '../TotalBalance';
import UnknownOwner from './UnknownOwner';

const NavbarAccountDetails = React.memo(({ uniqueAddress }: { uniqueAddress: string }) => {
  const { isLoggedIn } = useGetLoginInfo();

  const safeName = useSelector(safeNameStoredSelector);
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const currentContract = useSelector(currentMultisigContractSelector);
  const [displayOwnershipWarning, setDisplayOwnershipWarning] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [openedSafeSelect, setOpenedSafeSelect] = useState(false);
  const [displayableAddress, setDisplayableAddress] = useState(uniqueAddress);
  const menuRef = useRef<HTMLElement>();

  const {
    membersCountState: [membersCount],
    isMultiWalletMode,
  } = useOrganizationInfoContext();

  const handleQrModal = () => {
    setShowQr(!showQr);
  };

  useEffect(() => {
    ((async function checkContractOwnership() {
      const contractDetails = await ElrondApiProvider.getAccountDetails(currentContract?.address);
      const isItsOwnOwner = contractDetails?.ownerAddress === contractDetails?.address;
      setDisplayOwnershipWarning(!isItsOwnOwner);
    })());
  }, [currentContract?.address]);

  const openSafeSelection = useCallback(() => {
    setOpenedSafeSelect(true);
  }, []);

  useEffect(() => {
    const result = uniqueAddress.length === 0 ? 'No safe' : uniqueAddress;
    setDisplayableAddress(result);
  }, [uniqueAddress]);

  useEffect(() => {
    const handler = (e: any) => {
      if (!menuRef.current?.contains(e.target)) setOpenedSafeSelect(false);
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });

  return (
    <Box>

      <Grid
        container
        spacing={1}
        sx={{ mt: 1 }}
        justifyContent="center"
        alignItems="center"
        padding="0px"
        textAlign="center"
      >
        <Grid item position="relative" sx={{ paddingTop: '0 !important', paddingLeft: '0 !important' }} sm={3}>
          <Box display="table">
            <img src={Safe} alt="safe" width="60px" height="60px" />
          </Box>
          <Grow in={displayOwnershipWarning}>
            <div>
              <UnknownOwner />
            </div>
          </Grow>
          <Box position="absolute" top="-1.4rem" left="-.5rem">
            <MembersBox>
              <Typography>{membersCount}</Typography>
            </MembersBox>
          </Box>
        </Grid>
        <Grid sx={{ pl: 0 }}>
          <Box
            sx={{ ml: 0.5 }}
            className="d-flex justify-content-start align-items-center"
          >
            <Text align="center" lineHeight="1">
              {safeName?.length > 0
                ? safeName
                : displayableAddress
              }
            </Text>

            {openedSafeSelect === true && (
              <Box>
                <Box
                  onClick={() => {
                    setOpenedSafeSelect(false);
                  }}
                  sx={{
                    '& .css-i4bv87-MuiSvgIcon-root': {
                      color: 'rgba(76, 47, 252, 0.54) !important',
                    },
                  }}
                >
                  <ArrowDropUpIcon />
                </Box>
                {openedSafeSelect === true && (
                <SafeOptions ref={menuRef} />
                )}
              </Box>
            )}
            {openedSafeSelect === false && (
              <Box
                sx={{
                  '& .css-i4bv87-MuiSvgIcon-root': {
                    color: 'rgba(76, 47, 252, 0.54) !important',
                  },
                }}
              >
                {isMultiWalletMode && isLoggedIn && (
                <ArrowDropDownIcon
                  onClick={openSafeSelection}
                />
                )}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              mb: 0.7,
            }}
          >
            <Box
              onClick={handleQrModal}
              sx={{
                mr: 1.7,
                ml: 0.2,
                cursor: 'pointer',
              }}
            >
              <QrCode2Icon />
            </Box>
            <Box sx={{ mr: 1.85, ml: 0.35 }}>
              <CopyButton text={currentContract?.address} />
            </Box>
            <Box>
              <Anchor
                href={`${network.explorerAddress}/accounts/${currentContract?.address}`}
                target="_blank"
                rel="noreferrer"
                color="#6c757d"
              >
                <ContentPasteGoOutlinedIcon />
              </Anchor>
            </Box>
          </Box>
          <ReceiveModal
            showQrFromSidebar={showQr}
            address={currentContract?.address}
            handleQr={handleQrModal}
          />
        </Grid>
        {isInReadOnlyMode && (
        <Grid item sx={{ mt: 1.2, mb: 1.1, paddingTop: '0 !important', paddingLeft: '0 !important' }} sm={8.3}>
          <ReadOnly>
            Read-only
          </ReadOnly>
        </Grid>
        )}
      </Grid>
      <hr />
      <TotalBalance />
    </Box>
  );
});

export default NavbarAccountDetails;
