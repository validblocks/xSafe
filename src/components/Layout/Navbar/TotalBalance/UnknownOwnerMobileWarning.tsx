import { Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ModalTypes } from 'src/types/Proposals';
import { useContractData } from 'src/utils/useContractData';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { MembersBox } from '../navbar-style';

const UnknownOwnerMobileWarning = () => {
  const dispatch = useDispatch();

  const handleWarningButtonClick = useCallback(async () => {
    dispatch(setProposeModalSelectedOption({ option: ModalTypes.change_owner }));
  }, [dispatch]);

  const currentContract = useSelector<StateType, MultisigContractInfoType>(currentMultisigContractSelector);
  const maxWidth600 = useMediaQuery('(max-width: 600px)');
  const { contractData } = useContractData();

  if (maxWidth600 && currentContract?.address && contractData?.ownerAddress !== currentContract?.address) {
    return (
      <Box
        sx={{ cursor: 'pointer' }}
        right="-.15rem"
        onClick={handleWarningButtonClick}
      >
        <MembersBox
          sx={{
            height: '40px',
            width: '40px !important',
            marginLeft: '10px !important',
            marginTop: '0 !important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>
            <PriorityHighIcon color="warning" sx={{ marginTop: '-3px', fontSize: '17px' }} />
          </Typography>
        </MembersBox>
      </Box>
    );
  }
  return <div />;
};

export default UnknownOwnerMobileWarning;
