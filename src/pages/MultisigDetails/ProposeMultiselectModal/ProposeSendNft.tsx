import React, { useEffect, useMemo } from 'react';
import { FormikProps, useFormik } from 'formik';
import { FormikInputField } from 'src/helpers/formikFields';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectedNftToSendSelector } from 'src/redux/selectors/modalsSelector';
import { Address } from '@multiversx/sdk-core/out';
import { MultisigSendNft } from 'src/types/MultisigSendNft';
import { useQueryClient } from 'react-query';
import useNft from 'src/utils/useNft';
import { Box, useMediaQuery } from '@mui/material';
import NftPresentation from 'src/components/NftComponent/NftPresentation';
import { ModalDivider } from 'src/components/Utils/styled';

interface ProposeSendNftType {
  handleChange: (proposal: MultisigSendNft) => void;
  setSubmitDisabled: (value: boolean) => void;
}

interface IFormValues {
  address: string;
  identifier: string;
  nonce: string;
}

function validateRecipient(value?: string) {
  try {
    // eslint-disable-next-line no-new
    new Address(value);
    return true;
  } catch (err) {
    return false;
  }
}

const ProposeSendNft = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSendNftType) => {
  const { t } = useTranslation();

  let formik: FormikProps<IFormValues>;

  const selectedNft = useSelector(selectedNftToSendSelector);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        address: Yup.string()
          .min(2, 'Too Short!')
          .max(500, 'Too Long!')
          .required('Required')
          .test(validateRecipient),
        identifier: Yup.string().required('Required'),
        nonce: Yup.string().required('Required'),
      }),
    [],
  );

  // eslint-disable-next-line prefer-const
  formik = useFormik({
    initialValues: {
      address: '',
      identifier: selectedNft?.identifier ?? '',
      nonce: selectedNft?.nonce ?? '',
    },
    onSubmit: () => undefined,
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const queryClient = useQueryClient();

  const { searchedNft } = useNft(queryClient, selectedNft.identifier);

  const { touched, errors, values } = formik;
  // eslint-disable-next-line prefer-const
  let { address, identifier, nonce } = values;

  const getProposal = (): MultisigSendNft | null => {
    try {
      const parsedAddress = new Address(address);
      return new MultisigSendNft(parsedAddress, identifier, nonce);
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
  }, [address, identifier, nonce]);

  React.useEffect(() => {
    refreshProposal();
  }, [address, identifier, nonce]);

  const maxWidth600 = useMediaQuery('(max-width:600px)');

  console.log({ searchedNft });

  return (
    <Box>
      <NftPresentation
        nft={searchedNft}
      />
      <ModalDivider />
      <Box sx={{ p: maxWidth600 ? '1.25rem 16px 0' : '1.25rem 48px 0', m: ' 0 0 1rem' }}>
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
    </Box>
  );
};

export default ProposeSendNft;
