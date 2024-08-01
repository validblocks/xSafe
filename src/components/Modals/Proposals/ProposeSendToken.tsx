import { memo, useCallback, useEffect, useMemo } from 'react';
import { Address, BigUIntValue, TokenTransfer } from '@multiversx/sdk-core/out';
import { Box, useMediaQuery } from '@mui/material';
import { FormikProps, FormikProvider, useFormik } from 'formik';
import { motion } from 'framer-motion';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { FormikInputField } from 'src/helpers/formikFields';
import { tokenTableRowsSelector } from 'src/redux/selectors/accountSelector';
import { selectedTokenToSendSelector } from 'src/redux/selectors/modalsSelector';
import { MultisigSendToken } from 'src/types/multisig/proposals/MultisigSendToken';
import { TokenTableRowItem } from 'src/types/organization';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { MultisigSendEgld } from 'src/types/multisig/proposals/MultisigSendEgld';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import AmountInputWithTokenSelection from 'src/components/Utils/AmountInputWithTokenSelection';
import * as Styled from '../../MultisigDetails/ProposeMultiselectModal/styled';
import { isAddressValid } from 'src/helpers/validation';
import useAmountInputController from 'src/hooks/useAmountInputController';
import BigNumber from 'bignumber.js';

interface ProposeSendTokenType {
  handleChange: (proposal: MultisigSendToken | MultisigSendEgld) => void;
  setSubmitDisabled: (value: boolean) => void;
}

export type TokenPresentationProps = {
  identifier: string;
};

interface IFormValues {
  address: string;
  identifier: string;
  amount: string;
  data?: string;
}

const ProposeSendToken = memo(
  ({ handleChange, setSubmitDisabled }: ProposeSendTokenType) => {
    const { amount, setAmount } = useAmountInputController('0');

    const t = useCustomTranslation();
    const selectedToken = useSelector(selectedTokenToSendSelector);
    const { identifier } = selectedToken;
    const tokenTableRows = useSelector<StateType, TokenTableRowItem[]>(
      tokenTableRowsSelector,
    );
    const maxWidth600 = useMediaQuery('(max-width:600px)');

    const selectedTokenDetails = useMemo(
      () =>
        tokenTableRows?.find(
          (token: TokenTableRowItem) => token?.identifier === identifier,
        ),
      [identifier, tokenTableRows],
    );

    const currentContract = useSelector(currentMultisigContractSelector);

    const formik: FormikProps<IFormValues> = useFormik({
      initialValues: {
        address: '',
        data: '',
      },
      validationSchema: Yup.object().shape({
        data: Yup.string(),
        address: Yup.string()
          .min(2, 'Too Short!')
          .max(500, 'Too Long!')
          .required('Required')
          .test('is valid address', 'Not a valid address', isAddressValid)
          .test(
            'is not self address',
            'Contract can not send to itself',
            (value?: string) => {
              try {
                const isCurrentContractAddress =
                  value === currentContract?.address;
                return !isCurrentContractAddress;
              } catch (err) {
                return false;
              }
            },
          ),
      }),
      validateOnChange: true,
      validateOnMount: true,
    } as any);

    const { touched, errors, values } = formik;
    const { address, data } = values;

    const getSendEgldProposal = useCallback((): MultisigSendEgld | null => {
      try {
        const addressParam = new Address(address);

        const amountNumeric = new BigNumber(amount?.replaceAll(',', ''));

        const amountParam = new BigUIntValue(
          TokenTransfer.egldFromAmount(amountNumeric).valueOf(),
        );

        return new MultisigSendEgld(addressParam, amountParam, data ?? '');
      } catch (err) {
        console.error('Error[SendToken]: ', err);
        return null;
      }
    }, [address, data, amount]);

    const getSendTokenProposal = useCallback(
      (amountParam: string): MultisigSendToken | null => {
        try {
          amountParam = amountParam.replaceAll(',', '');
          const amountNumeric = Number(amountParam ?? 0);
          if (Number.isNaN(amountNumeric)) {
            return null;
          }
          const parsedAddress = new Address(address);
          const amountToSend = Number(
            TokenTransfer.fungibleFromAmount(
              identifier,
              amountParam,
              selectedTokenDetails?.value?.decimals ?? 18,
            ).toString(),
          );

          return new MultisigSendToken(parsedAddress, identifier, amountToSend);
        } catch (err) {
          return null;
        }
      },
      [address, identifier, selectedTokenDetails],
    );

    const refreshProposal = useCallback(() => {
      setTimeout(() => {
        const proposal =
          identifier === 'EGLD'
            ? getSendEgldProposal()
            : getSendTokenProposal(amount);

        if (proposal !== null) {
          handleChange(proposal);
        }
      }, 100);
    }, [
      amount,
      getSendEgldProposal,
      getSendTokenProposal,
      handleChange,
      identifier,
    ]);

    const addressError = touched.address && errors.address;

    useEffect(() => {
      const shouldBeDisabled = !(formik.isValid && formik.dirty);
      setSubmitDisabled(shouldBeDisabled);
    }, [amount, address, setSubmitDisabled, formik.isValid, formik.dirty]);

    useEffect(() => {
      refreshProposal();
    }, [refreshProposal]);

    return (
      <FormikProvider value={formik}>
        <Box padding={maxWidth600 ? '16px 16px 4.8px' : '30.88px 40px 4.8px'}>
          <FormikInputField
            label={t('Send to')}
            name="address"
            value={address}
            error={addressError}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            className={addressError != null ? 'isError' : ''}
          />

          <AmountInputWithTokenSelection
            onAmountChange={setAmount}
            onAmountIsLessThanAllowed={() => setSubmitDisabled(true)}
            onAmountIsNaN={() => setSubmitDisabled(true)}
            onAmountIsBiggerThanBalance={() => setSubmitDisabled(true)}
            onAmountIsZero={() => setSubmitDisabled(true)}
            onSuccessfulAmountValidation={() => {
              const isDisabled = !formik.isValid || !formik.dirty;
              setSubmitDisabled(isDisabled);
            }}
            config={{
              withTokenSelection: true,
              withAvailableAmount: true,
              isEsdtOrEgldRelated: true,
            }}
          />
          {identifier === 'EGLD' && (
            <motion.div
              key="Data"
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <Styled.DataTextField
                variant="outlined"
                label={t('Data (optional)') as string}
                placeholder="Your message here"
                id={data}
                name="data"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </motion.div>
          )}
        </Box>
      </FormikProvider>
    );
  },
);

export default ProposeSendToken;
