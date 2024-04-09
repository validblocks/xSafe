import { Address } from '@multiversx/sdk-core';
import { useFormik } from 'formik';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { useSelector } from 'react-redux';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import * as Yup from 'yup';
import { AddressBook } from 'src/types/organization';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';
import { RootState } from 'src/redux/store';
import { SelectedOptionType } from 'src/types/multisig/proposals/Proposals';
import { useEffect } from 'react';

type ProposeEditOwnerType = {
  selectedOption: SelectedOptionType;
  handleSetAddress: (address: Address) => void;
  handleSetName: (name: string) => void;
};

const EditOwner = ({
  selectedOption,
  handleSetAddress,
  handleSetName,
}: ProposeEditOwnerType) => {
  const theme = useCustomTheme();
  const addressBook = useSelector<RootState, AddressBook>(addressBookSelector);
  const t = useCustomTranslation();
  const address = 'address' in selectedOption! ? selectedOption?.address : '';
  const name = addressBook[address] || '';

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(500, 'Too Long!')
      .required('Required'),
  });

  const editOwnerForm = useFormik({
    initialValues: {
      name,
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  useEffect(() => {
    if (address != null) {
      handleSetAddress(new Address(address));
    }
  }, []);
  useEffect(() => {
    handleSetName(editOwnerForm.values.name);
  }, [editOwnerForm.values.name]);

  if (selectedOption === undefined) {
    return null;
  }

  return (
    <form
      className="modal-controll-container"
      onSubmit={editOwnerForm.handleSubmit}
    >
      <label htmlFor="name">
        <Text>{t('Name')}</Text>
      </label>
      <input
        id="name"
        name="name"
        type="text"
        className="form-control"
        onChange={editOwnerForm.handleChange}
        value={editOwnerForm.values.name}
        style={{
          backgroundColor: theme.palette.background.secondary,
          color: theme.palette.text.primary,
          borderColor: theme.palette.borders.secondary,
        }}
      />

      <div
        className="h6 mb-spacer text-break remove-user"
        data-testid="delegateSubTitle"
      />
      <div>
        <Text>{t('Address')}</Text>
      </div>
      <div
        className="h6 mb-spacer text-break remove-user"
        data-testid="delegateSubTitle"
      >
        <Text
          sx={{ borderColor: `${theme.palette.borders.secondary} !important` }}
          className="address"
        >
          {address}
        </Text>
      </div>
    </form>
  );
};

export default EditOwner;
