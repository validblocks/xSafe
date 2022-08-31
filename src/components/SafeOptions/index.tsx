import { useState, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Box, Button, Grid, Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
// import OtherSafe from 'src/assets/img/other-safe.png';
import Safe from 'src/assets/img/safe.png';
import { TypographyBold } from 'src/components/Theme/StyledComponents';
import {
  currencyConvertedSelector,
  selectedCurrencySelector,
} from 'src/redux/selectors/currencySelector';
import { useNavigate } from 'react-router-dom';
import DeployStepsModal from 'src/pages/Dashboard/DeployMultisigModal';
import { setCurrentMultisigContract, setMultisigContracts } from 'src/redux/slices/multisigContractsSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import {
  ActiveWallet,
  AddSafe,
  AddSafeWrapper,
  InactiveWallet,
  SafeOptionsWrapper,
} from './safe-style';

const fetchedMultisigContracts = [
  {
    name: 'Graffino 1',
    address: 'erd1qqqqqqqqqqqqqpgq5hfs4zxcvp7rgmwgcjvwg6m2zxpdugcvvcts8rj9zw',
  },
  {
    name: 'Graffino 2',
    address: 'erd1qqqqqqqqqqqqqpgqpzrenhspvt95agycr9nzhvrt7ukygwmmvctscqueu7',
  },
  {
    name: 'Graffino 3',
    address: 'erd1qqqqqqqqqqqqqpgqalhsgtumpjmtxnlfnk76984c9xwf0c77vcts47c9u7',
  },
];

const SafeOptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  // useEffect(() => {
  //   setShortAddress(addressShorthand);
  // }, [addressShorthand]);

  const [showDeployMultisigModal, setShowDeployMultisigModal] = useState(false);

  async function onDeployClicked() {
    setShowDeployMultisigModal(true);
  }

  const currentContract = useSelector(currentMultisigContractSelector);
  const [selectedSafe, setSelectedSafe] = useState(currentContract?.address);

  const currencyConverted = useSelector(currencyConvertedSelector);
  const getCurrency = useSelector(selectedCurrencySelector);
  const onSafeChange = (newSafeAddress: string) => {
    if (!newSafeAddress) return;
    setSelectedSafe(newSafeAddress);
    dispatch(setCurrentMultisigContract(newSafeAddress));
    navigate(`/multisig/${newSafeAddress}`);
  };
  const updateMultisigContract = useCallback((
    newContracts: MultisigContractInfoType[],
  ) => {
    dispatch(setMultisigContracts(newContracts));
  }, [dispatch]);

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
          <>
            <Divider />
            <Button sx={{ p: 0, width: '100%' }} onClick={() => onSafeChange(fetchedContract.address)}>
              <Box sx={{ p: 1, width: '100%' }} className="d-flex align-items-center">
                <Grid sm={3}>
                  <img src={Safe} width="60px" height="60px" alt="safe" />
                </Grid>
                <Grid sm={7}>
                  {selectedSafe === fetchedContract.address ? (
                    <ActiveWallet sx={{ ml: 2 }}>
                      <TypographyBold align="left">{fetchedContract.name}</TypographyBold>
                      <TypographyBold align="left">
                        ≈
                        {currencyConverted.toFixed(2)}
                        {getCurrency}
                      </TypographyBold>
                    </ActiveWallet>
                  ) : (
                    <InactiveWallet sx={{ ml: 2 }}>
                      <TypographyBold align="left">{fetchedContract.name}</TypographyBold>
                      <TypographyBold align="left">
                        ≈
                        {currencyConverted.toFixed(2)}
                        {getCurrency}
                      </TypographyBold>
                    </InactiveWallet>
                  )}

                </Grid>
                {
                  selectedSafe === fetchedContract.address && (
                  <Grid sm={2}>
                    <Box>
                      <Checkbox {...label} disabled checked />
                    </Box>
                  </Grid>
                  )
                }

              </Box>
            </Button>
          </>
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
