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
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import {
  ActiveWallet,
  AddSafe,
  AddSafeWrapper,
  InactiveWallet,
  SafeOptionsWrapper,
} from './safe-style';

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

const fetchedMultisigContracts = [
  {
    name: 'Graffino 1',
    address: 'erd1qqqqqqqqqqqqqpgq5hfs4zxcvp7rgmwgcjvwg6m2zxpdugcvvcts8rj9zw',
    role: 'Viewer',
  },
  {
    name: 'Graffino 2',
    address: 'erd1qqqqqqqqqqqqqpgqpzrenhspvt95agycr9nzhvrt7ukygwmmvctscqueu7',
    role: 'Viewer',
  },
  {
    name: 'Graffino 3',
    address: 'erd1qqqqqqqqqqqqqpgqalhsgtumpjmtxnlfnk76984c9xwf0c77vcts47c9u7',
    role: 'Viewer',
  },
];

const SafeOptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { address } = useGetAccountInfo();
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const currentContract = useSelector(currentMultisigContractSelector);
  const [selectedSafe, setSelectedSafe] = useState(currentContract?.address);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = useState(false);

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
    if (!address) return;

    console.log('querying user roles');
    const userRolePromises: Promise<number>[] = [];
    fetchedMultisigContracts.forEach(
      (contract: MultisigContractInfoType) => userRolePromises.push(queryUserRoleOnContract(address, contract.address)),
    );

    Promise.all(userRolePromises).then((userRoleResponse) => {
      console.log({ userRoleResponse });
      userRoleResponse.forEach((roleNumber: number, index: number) => {
        fetchedMultisigContracts[index] = {
          ...fetchedMultisigContracts[index],
          role: userRoleAsString(roleNumber),
        };
      });

      console.log(fetchedMultisigContracts);
    });
  }, [address, fetchedMultisigContracts]);

  return (
    <SafeOptionsWrapper sx={{ overflow: 'scroll !important', zIndex: '100000 !important' }}>
      <Typography sx={{ p: 2 }} align="left">
        Safe Options
      </Typography>
      <Divider />
      <AddSafeWrapper sx={{ p: 2, pl: 0 }}>
        <AddSafe onClick={() => onDeployClicked()}>
          <AddIcon sx={{ mr: 1 }} />
          Add a new safe
        </AddSafe>
      </AddSafeWrapper>
      {
        fetchedMultisigContracts.map((fetchedContract) => (
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
                      <TypographyBold align="left">{fetchedContract.name}</TypographyBold>
                      <TypographyBold align="left">
                        {fetchedContract.role}
                      </TypographyBold>
                    </ActiveWallet>
                  ) : (
                    <InactiveWallet sx={{ ml: 2 }}>
                      <TypographyBold align="left">{fetchedContract.name}</TypographyBold>
                      <TypographyBold align="left">
                        {fetchedContract.role}
                      </TypographyBold>
                    </InactiveWallet>
                  )}

                </Grid>
                {
                  selectedSafe === fetchedContract.address && (
                  <Grid item sm={2}>
                    <Box>
                      <Checkbox {...label} disabled checked />
                    </Box>
                  </Grid>
                  )
                }

              </Box>
            </Button>
          </Box>
        ))
      }

      <DeployStepsModal
        show={showDeployMultisigModal}
        handleClose={() => setShowDeployMultisigModal(false)}
        setNewContracts={updateMultisigContract}
      />
    </SafeOptionsWrapper>
  );
};

export default SafeOptions;
