import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OtherSafe from 'assets/img/other-safe.png';
import Safe from 'assets/img/safe.png';
import { TypographyBold } from 'components/Theme/StyledComponents';
import addressShorthand from 'helpers/addressShorthand';
import { uniqueContractAddress } from 'multisigConfig';
import DeployStepsModal from 'pages/Dashboard/DeployMultisigModal';
import {
  currencyConvertedSelector,
  selectedCurrencySelector
} from 'redux/selectors/currencySelector';
import { setProposeMultiselectSelectedOption } from 'redux/slices/modalsSlice';
import { setMultisigContracts } from 'redux/slices/multisigContractsSlice';
import { MultisigContractInfoType } from 'types/multisigContracts';
import { ProposalsTypes } from 'types/Proposals';
import {
  ActiveWallet,
  AddSafe,
  AddSafeWrapper,
  InactiveWallet,
  SafeOptionsWrapper
} from './safe-style';

function SafeOptions({ closeSafeDropdown }: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shortAddress, setShortAddress] = useState('');
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  useEffect(() => {
    setShortAddress(addressShorthand);
  }, [addressShorthand]);

  const addSafe = () =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.add_proposer
      })
    );

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
    newContracts: MultisigContractInfoType[]
  ) {
    dispatch(setMultisigContracts(newContracts));
  }
  return (
    <SafeOptionsWrapper>
      <Typography sx={{ p: 2 }} align='left'>
        Safe Options
      </Typography>
      <Divider />
      <AddSafeWrapper sx={{ p: 2, pl: 0 }}>
        <AddSafe onClick={onDeployClicked}>
          <AddIcon sx={{ mr: 1 }} />
          Add a new safe
        </AddSafe>
      </AddSafeWrapper>
      <Divider />
      <Button sx={{ p: 0, width: '100%' }} onClick={onEnterClicked}>
        <Box sx={{ p: 1, width: '100%' }} className='d-flex align-items-center'>
          <Grid sm={3}>
            <img src={Safe} width='60px' height='60px' />
          </Grid>
          <Grid sm={7}>
            <ActiveWallet sx={{ ml: 2 }}>
              <TypographyBold align='left'>My Safe</TypographyBold>
              <Typography align='left'>{shortAddress}</Typography>
              <TypographyBold align='left'>
                ≈{currencyConverted.toFixed(2)}
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
        <Box sx={{ p: 1, width: '100%' }} className='d-flex align-items-center'>
          <Grid sm={3}>
            <img src={OtherSafe} width='60px' height='60px' />
          </Grid>
          <Grid sm={7}>
            <InactiveWallet sx={{ ml: 2 }}>
              <TypographyBold align='left'>My Other Safe</TypographyBold>
              <Typography align='left'>{shortAddress}</Typography>
              <TypographyBold align='left'>14,590 USD</TypographyBold>
            </InactiveWallet>
          </Grid>
          <Grid sm={2}>
            <></>
          </Grid>
        </Box>
      </Button>
      <DeployStepsModal
        show={showDeployMultisigModal}
        handleClose={() => setShowDeployMultisigModal(false)}
        setNewContracts={updateMultisigContract}
      />
    </SafeOptionsWrapper>
  );
}

export default SafeOptions;
