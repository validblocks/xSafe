import { Address } from '@elrondnetwork/erdjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectedOptionType } from 'src/types/Proposals';

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

  useEffect(() => {
    if (address != null) {
      handleSetAddress(new Address(address));
    }
  }, []);
  if (selectedOption === undefined) {
    return null;
  }

  return (
    <div className="modal-control-container">
      <label htmlFor="delegateSubTitle">{t('Address')}</label>
      <div
        id="delegateSubTitle"
        className="h6 mb-spacer text-break remove-user"
        data-testid="delegateSubTitle"
      >
        <p className="address">{address}</p>
      </div>
    </div>
  );
};

export default ProposeRemoveUser;
