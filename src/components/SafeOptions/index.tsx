import { useState, useCallback, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Box, Button, Grid, Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import OtherSafe from 'src/assets/img/other-safe.png';
import Safe from 'src/assets/img/safe.png';
import { TypographyBold } from 'src/components/Theme/StyledComponents';
import {
  currencyConvertedSelector,
  selectedCurrencySelector,
} from 'src/redux/selectors/currencySelector';
import { useNavigate } from 'react-router-dom';
import { uniqueContractAddress } from 'src/multisigConfig';
import DeployStepsModal from 'src/pages/Dashboard/DeployMultisigModal';
import { setMultisigContracts } from 'src/redux/slices/multisigContractsSlice';
import addressShorthand from 'src/helpers/addressShorthand';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import {
  ActiveWallet,
  AddSafe,
  AddSafeWrapper,
  InactiveWallet,
  SafeOptionsWrapper,
} from './safe-style';

const SafeOptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shortAddress, setShortAddress] = useState('');
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  useEffect(() => {
    setShortAddress(addressShorthand);
  }, [addressShorthand]);

  const [showDeployMultisigModal, setShowDeployMultisigModal] = useState(false);

  async function onDeployClicked() {
    setShowDeployMultisigModal(true);
  }

  const currencyConverted = useSelector(currencyConvertedSelector);
  const getCurrency = useSelector(selectedCurrencySelector);
  const onEnterClicked = () => {
    navigate(`/multisig/${uniqueContractAddress}`);
  };
  async function updateMultisigContract(
    newContracts: MultisigContractInfoType[],
  ) {
    dispatch(setMultisigContracts(newContracts));
  }
  return (
    <SafeOptionsWrapper>
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
      <Divider />
      <Button sx={{ p: 0, width: '100%' }} onClick={onEnterClicked}>
        <Box sx={{ p: 1, width: '100%' }} className="d-flex align-items-center">
          <Grid sm={3}>
            <img src={Safe} width="60px" height="60px" alt="safe" />
          </Grid>
          <Grid sm={7}>
            <ActiveWallet sx={{ ml: 2 }}>
              <TypographyBold align="left">My Safe</TypographyBold>
              <Typography align="left">{shortAddress}</Typography>
              <TypographyBold align="left">
                ≈
                {currencyConverted.toFixed(2)}
                {getCurrency}
              </TypographyBold>
            </ActiveWallet>
          </Grid>
          <Grid sm={2}>
            <Box>
              <Checkbox {...label} disabled checked />
            </Box>
          </Grid>
        </Box>
      </Button>
      <Divider />
      <Button sx={{ p: 0, width: '100%' }}>
        <Box sx={{ p: 1, width: '100%' }} className="d-flex align-items-center">
          <Grid sm={3}>
            <img src={OtherSafe} width="60px" height="60px" alt="safe" />
          </Grid>
          <Grid sm={7}>
            <InactiveWallet sx={{ ml: 2 }}>
              <TypographyBold align="left">My Other Safe</TypographyBold>
              <Typography align="left">{shortAddress}</Typography>
              <TypographyBold align="left">14,590 USD</TypographyBold>
            </InactiveWallet>
          </Grid>
          <Grid sm={2}>nbsp;</Grid>
        </Box>
      </Button>
      <DeployStepsModal
        show={showDeployMultisigModal}
        handleClose={() => setShowDeployMultisigModal(false)}
        setNewContracts={useCallback(updateMultisigContract, [dispatch])}
      />
    </SafeOptionsWrapper>
  );
};

export default SafeOptions;
