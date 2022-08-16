import React, { useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import { FormikInputField } from 'src/helpers/formikFields';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectedNftToSendSelector } from 'src/redux/selectors/modalsSelector';
import { Address } from '@elrondnetwork/erdjs/out';
import { MultisigSendNft } from 'src/types/MultisigSendNft';

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

  const { touched, errors, values } = formik;
  const { address, identifier, nonce } = values;

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
  const identifierError: any = touched.identifier && errors.identifier;

  useEffect(() => {
    setSubmitDisabled(!formik.isValid || !formik.dirty);
  }, [formik.isValid, formik.dirty]);
  useEffect(() => {
    setSubmitDisabled(!(formik.isValid && formik.dirty));
  }, [address, identifier, nonce]);

  React.useEffect(() => {
    refreshProposal();
  }, [address, identifier, nonce]);

  return (
    <div>
      <div className="modal-control-container mb-4">
        <FormikInputField
          label={t('Send to')}
          name={'address'}
          value={address}
          error={addressError}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
        />
      </div>
      <div className="modal-control-container mb-4">
        <FormikInputField
          label={t('Identifier')}
          name={'identifier'}
          value={identifier}
          disabled
          error={identifierError}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
        />
      </div>
      <div className="modal-control-container mb-4">
        <FormikInputField
          label={t('Nonce')}
          name={'nonce'}
          value={nonce}
          error={identifierError}
          disabled
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
        />
      </div>
    </div>
  );
};

export default ProposeSendNft;
