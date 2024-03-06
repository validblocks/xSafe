import { Address } from '@multiversx/sdk-core';
import { useFormik } from 'formik';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { AddressBook } from 'src/types/organization';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';
import { RootState } from 'src/redux/store';
import { SelectedOptionType } from 'src/types/multisig/proposals/Proposals';
import { useEffect } from 'react';

type ProposeReplaceOwnerType = {
  selectedOption: SelectedOptionType;
  handleSetAddress: (address: Address) => void;
  handleSetName: (name: string) => void;
};

const ReplaceOwner = ({
  selectedOption,
  handleSetAddress,
  handleSetName,
}: ProposeReplaceOwnerType) => {
  const addressBook = useSelector<RootState, AddressBook>(addressBookSelector);
  const t = useCustomTranslation();

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
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  useEffect(() => {
    if (currentOwner.address != null) {
      handleSetAddress(new Address(currentOwner.address));
    }
  }, []);

  useEffect(() => {
    handleSetName(replaceOwnerForm.values.name);
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
        <label htmlFor="name">{t('Name')}</label>
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
