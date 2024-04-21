import React, { useEffect } from 'react';
import { FormikProps, useFormik } from 'formik';
import { FormikInputField } from 'src/helpers/formikFields';
import * as Yup from 'yup';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { useSelector } from 'react-redux';
import { selectedNftToSendSelector } from 'src/redux/selectors/modalsSelector';
import { Address } from '@multiversx/sdk-core/out';
import { MultisigSendSft } from 'src/types/multisig/proposals/MultisigSendSft';
import { useQueryClient } from 'react-query';
import useNft from 'src/hooks/useNft';
import { Box, useMediaQuery } from '@mui/material';
import AmountInputWithTokenSelection from 'src/components/Utils/AmountInputWithTokenSelection';
import NftPresentation from 'src/components/Nfts/NftPresentation';
import * as Styled from '../../Utils/styled';
import { isAddressValid } from 'src/helpers/validation';
import useAmountInputController from 'src/hooks/useAmountInputController';

interface ProposeSendSftType {
  handleChange: (proposal: MultisigSendSft) => void;
  setSubmitDisabled: (value: boolean) => void;
}

interface IFormValues {
  address: string;
  identifier: string;
  nonce: string;
  amount: string;
}

const ProposeSendSft = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSendSftType) => {
  const t = useCustomTranslation();
  const { amount, handleAmountInputChange } = useAmountInputController('0');

  const selectedNft = useSelector(selectedNftToSendSelector);

  const formik: FormikProps<IFormValues> = useFormik({
    initialValues: {
      address: '',
      identifier: selectedNft?.identifier ?? '',
      nonce: selectedNft?.nonce ?? '',
    },
    onSubmit: () => undefined,
    validationSchema: Yup.object().shape({
      address: Yup.string()
        .min(2, 'Too Short!')
        .max(500, 'Too Long!')
        .required('Required')
        .test(isAddressValid),
      identifier: Yup.string().required('Required'),
      nonce: Yup.string().required('Required'),
    }),
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const queryClient = useQueryClient();

  const { searchedNft } = useNft(queryClient, selectedNft.identifier);

  const { touched, errors, values } = formik;
  const { address, identifier, nonce } = values;

  const getProposal = (): MultisigSendSft | null => {
    try {
      const parsedAddress = new Address(address);
      return new MultisigSendSft(parsedAddress, identifier, amount, nonce);
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

  const addressError = touched.address && errors.address;
  setSubmitDisabled(!formik.isValid || !formik.dirty);
  useEffect(() => {
    setSubmitDisabled(!(formik.isValid && formik.dirty));
  }, [
    address,
    formik.dirty,
    formik.isValid,
    identifier,
    nonce,
    setSubmitDisabled,
  ]);

  React.useEffect(() => {
    refreshProposal();
  }, [address, identifier, nonce]);

  const maxWidth600 = useMediaQuery('(max-width:600px)');

  return (
    <Box>
      <NftPresentation nft={searchedNft} />
      <Styled.ModalDivider />
      <Box
        sx={{
          p: maxWidth600 ? '1.25rem 16px 0' : '1.25rem 48px 0',
          m: ' 0 0 1rem',
        }}
      >
        <FormikInputField
          label={t('Send to')}
          name={'address'}
          value={address}
          handleChange={formik.handleChange}
          error={addressError}
          handleBlur={formik.handleBlur}
          className={addressError ? 'isError' : ''}
        />
      </Box>
      <Box sx={{ p: maxWidth600 ? '0 16px 0' : '0 48px 0', m: ' 0 0 1rem' }}>
        <AmountInputWithTokenSelection
          onInputChange={handleAmountInputChange}
          onAmountIsNaN={() => setSubmitDisabled(true)}
          onAmountIsZero={() => setSubmitDisabled(true)}
          onAmountIsLessThanAllowed={() => setSubmitDisabled(true)}
          onAmountIsBiggerThanBalance={() => setSubmitDisabled(true)}
          minAmountAllowed={'1'}
          maxValue={selectedNft.balance}
          config={{
            withTokenSelection: false,
            isEsdtOrEgldRelated: false,
            withAvailableAmount: false,
          }}
        />
      </Box>
    </Box>
  );
};

export default ProposeSendSft;
