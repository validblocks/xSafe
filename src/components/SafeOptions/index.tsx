import { useState, useCallback, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Box, Button, Grid, Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import Safe from 'src/assets/img/safe.png';
import { TypographyBold } from 'src/components/Theme/StyledComponents';
import { useNavigate } from 'react-router-dom';
import DeployStepsModal from 'src/pages/Dashboard/DeployMultisigModal';
import { setCurrentMultisigContract, setMultisigContracts } from 'src/redux/slices/multisigContractsSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useQueryClient } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { queryUserRoleOnContract } from 'src/contracts/MultisigContract';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useGetAccountInfo, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { useTheme } from 'styled-components';
import {
  ActiveWallet,
  AddSafe,
  AddSafeWrapper,
  InactiveWallet,
  SafeOptionsWrapper,
} from './safe-style';
import { Text } from '../StyledComponents/StyledComponents';

export const userRoleAsString = (roleNumber: number) => {
  switch (roleNumber) {
    case 0:
      return 'No rights';
    case 2:
      return 'Board Member';
    default:
      return 'Not logged in';
  }
};

const fetchedMultisigContracts: MultisigContractInfoType[] = [
  {
    name: 'Graffino 1',
    address: 'erd1qqqqqqqqqqqqqpgq5hfs4zxcvp7rgmwgcjvwg6m2zxpdugcvvcts8rj9zw',
    role: '',
  },
  {
    name: 'Graffino 2',
    address: 'erd1qqqqqqqqqqqqqpgqpzrenhspvt95agycr9nzhvrt7ukygwmmvctscqueu7',
    role: '',
  },
  {
    name: 'Graffino 3',
    address: 'erd1qqqqqqqqqqqqqpgqalhsgtumpjmtxnlfnk76984c9xwf0c77vcts47c9u7',
    role: '',
  },
  {
    name: 'Graffino 2',
    address: 'erd1qqqqqqqqqqqqqpgqpzrenhspvt95agycr9nzhvrt7ukygwmmvctscqueu7',
    role: '',
  },
  {
    name: 'Graffino 3',
    address: 'erd1qqqqqqqqqqqqqpgqalhsgtumpjmtxnlfnk76984c9xwf0c77vcts47c9u7',
    role: '',
  },
  {
    name: 'Graffino 2',
    address: 'erd1qqqqqqqqqqqqqpgqpzrenhspvt95agycr9nzhvrt7ukygwmmvctscqueu7',
    role: '',
  },
  {
    name: 'Graffino 3',
    address: 'erd1qqqqqqqqqqqqqpgqalhsgtumpjmtxnlfnk76984c9xwf0c77vcts47c9u7',
    role: '',
  },
];

const SafeOptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();
  const currentContract = useSelector(currentMultisigContractSelector);
  const [selectedSafe, setSelectedSafe] = useState(currentContract?.address);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = useState(false);
  const [attachedMultisigContracts, setAttachedMultisigContracts] = useState(() => fetchedMultisigContracts);
  const theme: any = useTheme();

  function onDeployClicked() {
    setShowDeployMultisigModal(true);
  }

  const onSafeChange = (newSafeAddress: string) => {
    if (!newSafeAddress) return;
    setSelectedSafe(newSafeAddress);
    dispatch(setCurrentMultisigContract(newSafeAddress));
    queryClient.invalidateQueries([
      QueryKeys.ALL_ORGANIZATION_NFTS,
      QueryKeys.ADDRESS_EGLD_TOKENS,
      QueryKeys.ADDRESS_ESDT_TOKENS,
    ]);

    navigate(`/multisig/${newSafeAddress}`);
  };

  const updateMultisigContract = useCallback(
    (newContracts: MultisigContractInfoType[]) => dispatch(setMultisigContracts(newContracts)),
    [dispatch]);

  useEffect(() => {
    if (!address || !isLoggedIn) return;

    const userRolePromises: Promise<number>[] = [];
    fetchedMultisigContracts.forEach(
      (contract: MultisigContractInfoType) => userRolePromises.push(queryUserRoleOnContract(address, contract.address)),
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
  }, [address, isLoggedIn]);

  return (
    <SafeOptionsWrapper sx={{ overflow: 'scroll !important', zIndex: '1000 !important' }}>
      <Typography sx={{ p: 2 }} align="left">
        Safe Options
      </Typography>
      <Divider />
      {isLoggedIn && (
      <Box>
        <AddSafeWrapper sx={{ p: 2, pl: 0 }}>
          <AddSafe onClick={() => onDeployClicked()}>
            <AddIcon sx={{ mr: 1 }} />
            Add a new safe
          </AddSafe>
        </AddSafeWrapper>
        <Box maxHeight={385} overflow="scroll">
          {
        attachedMultisigContracts.map((fetchedContract) => (
          <Box key={fetchedContract.address}>
            <Divider />
            <Button sx={{ p: 0, width: '100%' }} onClick={() => onSafeChange(fetchedContract.address)}>
              <Box sx={{ p: 1, width: '100%' }} className="d-flex align-items-center">
                <Grid item sm={3}>
                  <img src={Safe} width="60px" height="60px" alt="safe" />
                </Grid>
                <Grid item sm={7}>
                  {selectedSafe === fetchedContract.address ? (
                    <ActiveWallet sx={{ ml: 2 }}>
                      <TypographyBold textTransform={'none'} align="left">{fetchedContract.name}</TypographyBold>
                      <Typography textTransform={'none'} align="left">
                        {fetchedContract.role}
                      </Typography>
                    </ActiveWallet>
                  ) : (
                    <InactiveWallet sx={{ ml: 2 }}>
                      <Typography textTransform={'none'} align="left">{fetchedContract.name}</Typography>
                      <Typography textTransform={'none'} align="left">
                        {fetchedContract.role}
                      </Typography>
                    </InactiveWallet>
                  )}

                </Grid>
                {
                  selectedSafe === fetchedContract.address && (
                  <Grid item sm={2}>
                    <Box>
                      <Checkbox
                        icon={<CheckCircleIcon htmlColor={theme.palette.primary.main} />}
                      />
                    </Box>
                  </Grid>
                  )
                }
              </Box>
            </Button>
          </Box>
        ))
        }
        </Box>
      </Box>
      )}
      {isLoggedIn === false && (
        <Box minHeight={200} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Text>Login first</Text>
        </Box>
      )}

      <DeployStepsModal
        show={showDeployMultisigModal}
        handleClose={() => setShowDeployMultisigModal(false)}
        setNewContracts={updateMultisigContract}
      />
    </SafeOptionsWrapper>
  );
};

export default SafeOptions;
