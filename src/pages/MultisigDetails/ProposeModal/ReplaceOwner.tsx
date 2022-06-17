import React from 'react';
import { Address } from '@elrondnetwork/erdjs';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { AddressBook } from 'pages/Organization/types';
import { addressBookSelector } from '@redux/selectors/addressBookSelector';
import { RootState } from '@redux/store';
import { SelectedOptionType } from 'types/Proposals';

type ProposeReplaceOwnerType = {
  selectedOption: SelectedOptionType;
  selectedAddress: Address;
  handleSetAddress: (address: Address) => void;
  handleSetReplacementAddress: (address: Address) => void;
  handleSetName: (name: string) => void;
};

const ReplaceOwner = ({
  selectedOption,
  handleSetAddress,
  handleSetReplacementAddress,
  handleSetName,
}: ProposeReplaceOwnerType) => {
  const addressBook = useSelector<RootState, AddressBook>(addressBookSelector);
  const { t }: { t: any } = useTranslation();

  const currentOwner =
    'currentOwner' in selectedOption!
      ? selectedOption?.currentOwner
      : { name: '', address: '' };

  const name = addressBook[currentOwner.address as string] || '';
  const { address } = currentOwner;

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(500, 'Too Long!')
      .required('Required'),
  });

  const replaceOwnerForm = useFormik({
    initialValues: {
      name: '',
      replacementAddress: '',
    },
    onSubmit: () => {},
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });

  React.useEffect(() => {
    if (currentOwner.address != null) {
      handleSetAddress(new Address(currentOwner.address));
    }
  }, []);

  React.useEffect(() => {
    handleSetName(replaceOwnerForm.values.name);
    // handleSetReplacementAddress(
    //   new Address(replaceOwnerForm.values.replacementAddress)
    // );
  }, [replaceOwnerForm.values]);

  if (selectedOption === undefined) {
    return null;
  }

  return (
    <form
      className="modal-controll-container"
      onSubmit={replaceOwnerForm.handleSubmit}
    >
      <p>Current owner:</p>
      Name:
      <span>{name}</span>
      Adress:
      <span>{address as string}</span>
      <fieldset>
        <label htmlFor="name">{t('Name')} </label>
        <input
          id="name"
          name="name"
          type="text"
          className="form-control"
          onChange={replaceOwnerForm.handleChange}
          value={replaceOwnerForm.values.name}
        />

        <div
          className="h6 mb-spacer text-break remove-user"
          data-testid="delegateSubTitle"
        />
        <label htmlFor={replaceOwnerForm.values.replacementAddress}>
          {t('Address')}
        </label>
        <input
          id={replaceOwnerForm.values.replacementAddress}
          name="replacementAddress"
          type="text"
          className="form-control"
          onChange={replaceOwnerForm.handleChange}
          value={replaceOwnerForm.values.replacementAddress}
        />
      </fieldset>
    </form>
  );
};

export default ReplaceOwner;
