import { useCallback, useMemo, useState } from 'react';
import { nominate } from '@multiversx/sdk-dapp/utils/operations';
import {
  Address,
  BigUIntValue,
  BytesValue,
  TokenTransfer,
} from '@multiversx/sdk-core/out';
import {
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  useMediaQuery,
} from '@mui/material';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { denomination } from 'src/config';
import { activeDelegationsRowsSelector } from 'src/redux/selectors/accountSelector';
import { selectedStakingProviderSelector } from 'src/redux/selectors/modalsSelector';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { setSelectedStakingProvider } from 'src/redux/slices/modalsSlice';
import { IdentityWithColumns } from 'src/types/staking';
import ProviderColumn from 'src/components/Staking/ProviderColumn';
import { Box } from '@mui/system';
import DelegatedColumn from 'src/components/Staking/DelegatedColumn';
import { MultisigSmartContractCall } from 'src/types/multisig/proposals/MultisigSmartContractCall';
import { useEffectDebugger } from 'src/hooks/useEffectDebugger';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import AmountInputWithTokenSelection from 'src/components/Utils/AmountInputWithTokenSelection';
import {
  StakedAssetsSelect,
  UnstakeModalContainerBox,
} from '../../MultisigDetails/styled';
import { DelegationFunction } from 'src/types/staking';
import useAmountInputController from 'src/hooks/useAmountInputController';
import { Converters } from 'src/utils/Converters';
import BigNumber from 'bignumber.js';

interface ProposeUnstakeTokensType {
  handleChange: (proposal: MultisigSmartContractCall) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const ProposeUnstakeTokens = ({
  handleChange,
  setSubmitDisabled,
}: ProposeUnstakeTokensType) => {
  const t = useCustomTranslation();
  const dispatch = useDispatch();
  const maxWidth600 = useMediaQuery('(max-width: 600px)');
  const [initialAmount, setInitialAmount] = useState('1');

  const activeDelegationsRows = useSelector<StateType, IdentityWithColumns[]>(
    activeDelegationsRowsSelector,
  );
  const selectedStakingProvider = useSelector(selectedStakingProviderSelector);
  const [identifier, setIdentifier] = useState(
    selectedStakingProvider?.provider,
  );

  const {
    handleAmountInputChange,
    amount,
    setAmount,
    amountError,
    updateAmountError,
  } = useAmountInputController('1');

  const getProposal = (): MultisigSmartContractCall | null => {
    try {
      const nominatedAmount = nominate(amount.toString(), denomination);

      const parsedAddress = new Address(identifier);

      let hexEncodedAmount = Converters.nominatedStringToHex(nominatedAmount);

      if (hexEncodedAmount.length % 2 !== 0) {
        hexEncodedAmount = `0${hexEncodedAmount}`;
      }
      const unDelegateAmount = BytesValue.fromHex(hexEncodedAmount);

      return new MultisigSmartContractCall(
        parsedAddress,
        new BigUIntValue(TokenTransfer.egldFromAmount(0).valueOf()),
        DelegationFunction.UNDELEGATE,
        [unDelegateAmount],
      );
    } catch (err) {
      return null;
    }
  };

  const refreshProposal = () => {
    setTimeout(() => {
      const proposal = getProposal();

      if (proposal !== null) {
        handleChange(proposal);
      }
    }, 100);
  };

  useEffectDebugger(() => {
    refreshProposal();
  }, [amount, identifier, amountError]);

  const onChange = (event: SelectChangeEvent) => {
    const newIdentifier = event.target.value;
    setIdentifier(newIdentifier);
    const newProvider = activeDelegationsRows.find(
      (provider) => provider.provider === newIdentifier,
    );
    dispatch(setSelectedStakingProvider(newProvider));
    setInitialAmount('1');

    const proposal = getProposal();

    if (proposal !== null) {
      handleChange(proposal);
    }
  };

  const delegatedAmount = useMemo(() => {
    const delegatedAmount =
      selectedStakingProvider?.delegatedColumn?.delegatedAmount;
    return delegatedAmount;
  }, [selectedStakingProvider?.delegatedColumn?.delegatedAmount]);

  const customAmountValidation = useCallback((value?: string) => {
    if (value == null) {
      return { isValid: false, errorMessage: t('Invalid amount') };
    }
    value = value.replace(',', '');
    const newAmount = Number(value);
    const delegatedAmount = Number(
      selectedStakingProvider?.delegatedColumn?.delegatedAmount ?? 0,
    );

    const leftOverStakedAmount = delegatedAmount - newAmount;
    if (leftOverStakedAmount < 1 && leftOverStakedAmount !== 0) {
      setSubmitDisabled(true);
      return {
        isValid: false,
        errorMessage: t('Can not leave behind less than 1 EGLD'),
      };
    }

    setSubmitDisabled(true);
    return {
      isValid: true,
      errorMessage: null,
    };
  }, []);

  const onAmountError = useCallback((amountErr?: string) => {
    updateAmountError(amountErr);
    setSubmitDisabled(true);
  }, []);

  return (
    <UnstakeModalContainerBox
      sx={{
        padding: maxWidth600 ? '1.4rem 16px .3rem' : '1.4rem 40px .3rem',
      }}
    >
      <div className="mb-4">
        <InputLabel id="demo-simple-select-label">
          <Text>Staking Provider</Text>
        </InputLabel>
        <StakedAssetsSelect
          value={identifier}
          fullWidth
          label="Identifier"
          size="small"
          MenuProps={{ className: 'UnstakeTokenListOpened' }}
          onChange={(e: any) => {
            onChange(e);
          }}
          className="mb-0"
        >
          {activeDelegationsRows?.map(
            (activeDelegation: IdentityWithColumns) => (
              <MenuItem
                key={activeDelegation?.provider}
                value={activeDelegation?.provider}
                sx={{ paddingY: '0' }}
              >
                <Box
                  padding={0}
                  width={'100%'}
                  display={'flex'}
                  alignItems="center"
                  justifyContent={'space-between'}
                >
                  <ProviderColumn
                    columnData={activeDelegation?.providerColumn}
                  />
                  <DelegatedColumn
                    columnData={
                      activeDelegation?.delegatedColumn ?? {
                        delegatedAmount: 'Unknown',
                      }
                    }
                  />
                </Box>
              </MenuItem>
            ),
          )}
        </StakedAssetsSelect>

        <span>
          Staked:{' '}
          {selectedStakingProvider?.delegatedColumn?.delegatedAmount ??
            'Unknown'}{' '}
          $EGLD
        </span>
      </div>
      <AmountInputWithTokenSelection
        maxAmountAllowed={delegatedAmount}
        minAmountAllowed={new BigNumber('1')}
        onInputChange={handleAmountInputChange}
        onSuccessfulAmountValidation={() => setSubmitDisabled(false)}
        onAmountError={onAmountError}
        onAmountChange={setAmount}
        customAmountValidation={customAmountValidation}
        initialAmount={new BigNumber(initialAmount)}
        config={{
          withTokenSelection: false,
          withAvailableAmount: false,
        }}
      />
    </UnstakeModalContainerBox>
  );
};

export default ProposeUnstakeTokens;
