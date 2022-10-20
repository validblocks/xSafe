import React, { useCallback, useEffect, useState, useRef, createContext, useContext, useMemo } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box, Typography, Grid,
} from '@mui/material';
import Grow from '@mui/material/Grow';
import { setMultisigContracts } from 'src/redux/slices/multisigContractsSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { useDispatch, useSelector } from 'react-redux';
import Safe from 'src/assets/img/safe.png';
import CopyButton from 'src/components/CopyButton';
import ReceiveModal from 'src/components/ReceiveModal';
import SafeOptions from 'src/components/SafeOptions';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { network } from 'src/config';
import { currentSafeNameSelector } from 'src/redux/selectors/safeNameSelector';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import DeployStepsModal from 'src/pages/Dashboard/DeployMultisigModal';
import { CustomStateType } from 'src/pages/Organization/types';
import {
  Anchor, MembersBox, ReadOnly,
} from '../navbar-style';
import TotalBalance from '../TotalBalance';
import UnknownOwner from './UnknownOwner';
import * as Styled from '../../../Utils/styled/index';
import { ActionIconsBox } from './styled/index';

interface IDeployStepsContextType {
  showDeployMultisigModalState: CustomStateType<boolean>;
  openDeployNewContractModal: () => void;
  updateMultisigContract: (newContracts: MultisigContractInfoType[]) => any
}
const DeployStepsContext = createContext<IDeployStepsContextType>(
  {} as IDeployStepsContextType,
);
export const useDeployStepsContext = () =>
  useContext(DeployStepsContext);
const NavbarAccountDetails = React.memo(({ uniqueAddress }: { uniqueAddress: string }) => {
  const { isLoggedIn } = useGetLoginInfo();
  const safeName = useSelector(currentSafeNameSelector);
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const [showQr, setShowQr] = useState(false);
  const [openedSafeSelect, setOpenedSafeSelect] = useState(false);
  const [displayableAddress, setDisplayableAddress] = useState(uniqueAddress);
  const [displayOwnershipWarning, setDisplayOwnershipWarning] = useState(false);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = useState(false);
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);
  const menuRef = useRef<HTMLElement>();
  const updateMultisigContract = useCallback(
    (newContracts: MultisigContractInfoType[]) => dispatch(setMultisigContracts(newContracts)),
    [dispatch]);
  const openDeployNewContractModal = useCallback(() => {
    setShowDeployMultisigModal(true);
  }, []);
  const contextValue = useMemo(() => ({
    showDeployMultisigModalState: [showDeployMultisigModal, setShowDeployMultisigModal] as CustomStateType<boolean>,
    openDeployNewContractModal,
    updateMultisigContract,
  }), [showDeployMultisigModal, openDeployNewContractModal, updateMultisigContract]);
  const closeDeployModal = useCallback(() => {
    setShowDeployMultisigModal(false);
  }, []);
  const openSafeSelection = useCallback(() => {
    setOpenedSafeSelect(true);
  }, []);
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
  useEffect(() => {
    const result = uniqueAddress.length === 0 ? 'No safe' : uniqueAddress;
    setDisplayableAddress(result);
  }, [uniqueAddress]);
  useEffect(() => {
    const handler = (e: any) => {
      if (!menuRef.current?.contains(e.target) && !showDeployMultisigModal) {
        setOpenedSafeSelect(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [showDeployMultisigModal]);
  return (
    <DeployStepsContext.Provider value={contextValue}>
      <Box>
        <DeployStepsModal
          show={showDeployMultisigModal}
          handleClose={closeDeployModal}
          setNewContracts={(newContracts) => updateMultisigContract(newContracts)}
        />
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
                    '& .MuiSvgIcon-root': {
                      color: '#4c2FFC !important',
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
                  '& .MuiSvgIcon-root': {
                    color: '#4c2FFC !important',
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
            <ActionIconsBox>
              <Box
                onClick={handleQrModal}
                sx={{
                  cursor: 'pointer',
                }}
              >
                <Styled.QrCodeReceive />
              </Box>
              <Box>
                <CopyButton text={currentContract?.address} color="grey" />
              </Box>
              <Box>
                <Anchor
                  href={`${network.explorerAddress}/accounts/${currentContract?.address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SearchIcon sx={{ color: '#6C757D !important' }} />
                </Anchor>
              </Box>
            </ActionIconsBox>
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
    </DeployStepsContext.Provider>
  );
});
export default NavbarAccountDetails;
