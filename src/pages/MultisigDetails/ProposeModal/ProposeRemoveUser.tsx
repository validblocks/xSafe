import React from 'react';
import { Address } from '@elrondnetwork/erdjs';
import { useTranslation } from 'react-i18next';
import { SelectedOptionType } from 'types/Proposals';

interface ProposeRemoveUserType {
  selectedOption: SelectedOptionType;
  handleSetAddress: (address: Address) => void;
}

const ProposeRemoveUser = ({
  selectedOption,
  handleSetAddress,
}: ProposeRemoveUserType) => {
  const { t }: { t: any } = useTranslation();
  const address = 'address' in selectedOption! ? selectedOption?.address : '';

  React.useEffect(() => {
    if (address != null) {
      handleSetAddress(new Address(address));
    }
  }, []);
  if (selectedOption === undefined) {
    return null;
  }

  return (
    <div className="modal-control-container">
      <label>{t('Address')} </label>
      <div
        className="h6 mb-spacer text-break remove-user"
        data-testid="delegateSubTitle"
      >
        <p className="address"> {address} </p>
      </div>
    </div>
  );
};

export default ProposeRemoveUser;
