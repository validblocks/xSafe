import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { MultisigContractInfoType } from 'src/types/multisig/multisigContracts';
import { setCurrentMultisigContract } from 'src/redux/slices/multisigContractsSlice';
import { useDispatch, useSelector } from 'react-redux';
import Safe from 'src/assets/img/safe.png';
import { TypographyBold } from 'src/components/Theme/StyledComponents';
import { useNavigate } from 'react-router-dom';
import {
  currentMultisigContractSelector,
  multisigContractsSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import { useQueryClient } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { queryUserRoleOnContract } from 'src/contracts/MultisigContract';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import {
  setIntervalEndTimestamp,
  setIntervalStartTimestamp,
  setIntervalStartTimestampForFiltering,
} from 'src/redux/slices/transactionsSlice';
import { lastXDays } from 'src/components/Transactions/TransactionHistoryIntervals';
import {
  ActiveWallet,
  AddSafe,
  InactiveWallet,
  SafeOptionsOverlay,
  SafeOptionsWrapper,
} from './safe-style';
import { Text } from '../StyledComponents/StyledComponents';
import { useDeployStepsContext } from '../Layout/Navbar/NavbarAccountDetails';

const userRoleAsString = (roleNumber: number) => {
  switch (roleNumber) {
    case 0:
      return 'No rights';
    case 2:
      return 'Member';
    default:
      return 'Not logged in';
  }
};

interface ISafeOptionsProps {
  closeSafe: () => void;
}

const SafeOptions = React.forwardRef(
  ({ closeSafe }: ISafeOptionsProps, ref) => {
    const theme = useCustomTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { address } = useGetAccountInfo();
    const { isLoggedIn } = useGetLoginInfo();
    const currentContract = useSelector(currentMultisigContractSelector);
    const fetchedMultisigContracts = useSelector(multisigContractsSelector);
    const [selectedSafe, setSelectedSafe] = useState(currentContract?.address);
    const [attachedMultisigContracts, setAttachedMultisigContracts] = useState(
      () => fetchedMultisigContracts,
    );

    const onSafeChange = (newSafeAddress: string) => {
      if (!newSafeAddress) return;
      setSelectedSafe(newSafeAddress);
      dispatch(setCurrentMultisigContract(newSafeAddress));

      const oneDayBefore = lastXDays.getTimestamp(1);
      dispatch(setIntervalStartTimestamp(oneDayBefore));
      dispatch(setIntervalEndTimestamp(new Date().getTime() / 1000));
      dispatch(setIntervalStartTimestampForFiltering(oneDayBefore));

      queryClient.invalidateQueries([
        QueryKeys.ALL_ORGANIZATION_NFTS,
        QueryKeys.ADDRESS_EGLD_TOKENS,
        QueryKeys.ADDRESS_ESDT_TOKENS,
        QueryKeys.ALL_TRANSACTIONS_WITH_LOGS_ENABLED,
      ]);
      queryClient.invalidateQueries(QueryKeys.ALL_PENDING_ACTIONS);

      navigate(`/multisig/${newSafeAddress}`);
      closeSafe();
    };

    useEffect(() => {
      if (!address || !isLoggedIn) return;

      const userRolePromises: Promise<number>[] = [];

      if (fetchedMultisigContracts.length <= 0) return;
      fetchedMultisigContracts.forEach((contract: MultisigContractInfoType) =>
        userRolePromises.push(
          queryUserRoleOnContract(address, contract.address),
        ),
      );

      Promise.all(userRolePromises).then((userRoleResponse) => {
        const walletAttachedContracts: MultisigContractInfoType[] = [];
        userRoleResponse.forEach((roleNumber: number, index: number) => {
          walletAttachedContracts.push({
            ...fetchedMultisigContracts[index],
            role: userRoleAsString(roleNumber),
          });
        });
        setAttachedMultisigContracts(walletAttachedContracts);
      });
    }, [address, fetchedMultisigContracts, isLoggedIn]);

    const { openDeployNewContractModal } = useDeployStepsContext();

    return (
      <SafeOptionsOverlay role="presentation">
        <SafeOptionsWrapper role="presentation" ref={ref}>
          <Typography sx={{ p: 2 }} align="left" fontWeight={600}>
            Safe Options
          </Typography>

          <Divider />
          {isLoggedIn && (
            <Box>
              <AddSafe
                onClick={() => {
                  closeSafe();
                  openDeployNewContractModal();
                }}
              >
                <AddIcon />
                Add a new safe
              </AddSafe>
              <Box maxHeight={385} overflow="auto">
                {Array.isArray(attachedMultisigContracts) &&
                  attachedMultisigContracts.map((fetchedContract: any) => (
                    <Box key={fetchedContract.address}>
                      <Divider />
                      <Button
                        sx={{ p: 0, width: '100%' }}
                        onClick={() => onSafeChange(fetchedContract.address)}
                      >
                        <Box
                          sx={{
                            p: 1,
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Grid item sm={3}>
                            <img
                              src={Safe}
                              width="60px"
                              height="60px"
                              alt="safe"
                            />
                          </Grid>
                          <Grid item sm={7}>
                            {selectedSafe === fetchedContract.address ? (
                              <ActiveWallet sx={{ ml: 2 }}>
                                <TypographyBold
                                  textTransform={'none'}
                                  align="left"
                                >
                                  <Text>
                                    {fetchedContract.name.length > 0
                                      ? fetchedContract.name
                                      : 'No name'}
                                  </Text>
                                </TypographyBold>
                                <Typography textTransform={'none'} align="left">
                                  <Text>{fetchedContract.role}</Text>
                                </Typography>
                              </ActiveWallet>
                            ) : (
                              <InactiveWallet sx={{ ml: 2 }}>
                                <Typography textTransform={'none'} align="left">
                                  <Text>
                                    {fetchedContract.name.length > 0
                                      ? fetchedContract.name
                                      : 'No name'}
                                  </Text>
                                </Typography>
                                <Typography textTransform={'none'} align="left">
                                  <Text>{fetchedContract.role}</Text>
                                </Typography>
                              </InactiveWallet>
                            )}
                          </Grid>
                          {selectedSafe === fetchedContract.address && (
                            <Grid item sm={2}>
                              <Box>
                                <Checkbox
                                  icon={
                                    <CheckCircleIcon
                                      htmlColor={theme.palette.primary.main}
                                    />
                                  }
                                />
                              </Box>
                            </Grid>
                          )}
                        </Box>
                      </Button>
                    </Box>
                  ))}
              </Box>
            </Box>
          )}
          {isLoggedIn === false && (
            <Box
              minHeight={200}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Text>Login first</Text>
            </Box>
          )}
        </SafeOptionsWrapper>
      </SafeOptionsOverlay>
    );
  },
);

export default SafeOptions;
