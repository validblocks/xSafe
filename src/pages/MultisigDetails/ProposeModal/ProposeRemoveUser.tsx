import { Address } from '@multiversx/sdk-core';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { SelectedOptionType } from 'src/types/Proposals';
import { Text } from 'src/components/StyledComponents/StyledComponents';

interface ProposeRemoveUserType {
  selectedOption: SelectedOptionType;
  handleSetAddress: (address: Address) => void;
}

function ProposeRemoveUser({
  selectedOption,
  handleSetAddress,
}: ProposeRemoveUserType) {
  const theme: any = useTheme();
  const { t } = useTranslation();
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
      <label htmlFor="delegateSubTitle"><Text>{t('Address') as string}</Text></label>
      <div
        id="delegateSubTitle"
        className="h6 mb-spacer text-break remove-user"
        data-testid="delegateSubTitle"
      >
        <Text className="address" sx={{ borderColor: `${theme.palette.borders.secondary} !important` }}>{address}</Text>
      </div>
    </div>
  );
}

export default ProposeRemoveUser;
