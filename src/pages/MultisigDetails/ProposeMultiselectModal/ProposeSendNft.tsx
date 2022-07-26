import React, { useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import { FormikInputField } from 'src/helpers/formikFields';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectedNftToSendSelector } from 'src/redux/selectors/modalsSelector';
import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigSendNft } from 'src/types/MultisigSendNft';
import { useQueryClient } from 'react-query';
import useNft from 'src/utils/useNft';
import { SearchedNFT } from 'src/components/Theme/StyledComponents';
import MemberPresentationWithPhoto from 'src/pages/Organization/MemberPresentationWithPhoto';
import { Box, Typography } from '@mui/material';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { truncateInTheMiddle } from 'src/utils/addressUtils';

interface ProposeSendNftType {
  handleChange: (proposal: MultisigSendNft) => void;
  setSubmitDisabled: (value: boolean) => void;
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

  const formik = useFormik({
    initialValues: {
      address: '',
      identifier: selectedNft?.identifier ?? '',
      nonce: selectedNft?.nonce ?? '',
    },
    onSubmit: () => undefined,
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });

  const queryClient = useQueryClient();

  const { searchedNft } = useNft(queryClient, selectedNft.identifier);

  console.log({ searchedNft });

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

  ({ address } = useGetAccountInfo());
  const memoizedAddress = useMemo(() => new Address(address), [address]);
  console.log('adresa', memoizedAddress);

  return (
    <Box>
      <Box sx={{ p: '1rem 2.5rem 0.9rem' }}>
        <SearchedNFT>
          <Typography sx={{ mb: '0.5rem', fontWeight: 500 }}>NFT name:</Typography>
          <div>
            <img src={searchedNft.url} alt="" width={40} height={40} className="rounded" />
            <span className="nftName">{searchedNft.name}</span>
          </div>
        </SearchedNFT>
        <Typography sx={{ mb: '0.5rem', fontWeight: 500 }}>
          Sending from:
        </Typography>
        <MemberPresentationWithPhoto
          memberAddress={memoizedAddress}
          charactersLeftAfterTruncation={15}
        />
      </Box>
      <hr />
      <Box sx={{ p: '1.25rem 2.5rem 0', m: ' 0 0 1rem' }}>
        <FormikInputField
          label={t('Send to')}
          name={'address'}
          value={truncateInTheMiddle(address, 24)}
          error={addressError}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
        />
      </Box>
    </Box>
  );
};

export default ProposeSendNft;
