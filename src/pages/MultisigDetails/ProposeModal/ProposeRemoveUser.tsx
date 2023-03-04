import { Address } from '@multiversx/sdk-core';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ProposalsTypes, SelectedOptionType } from 'src/types/Proposals';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { useQueryClient } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { MultisigRemoveUser } from 'src/types/MultisigRemoveUser';

interface ProposeRemoveUserType {
  selectedOption: SelectedOptionType;
  handleSetAddress: (address: Address) => void;
  setSubmitDisabled: (value: boolean) => void;
}

function ProposeRemoveUser({
  selectedOption,
  handleSetAddress,
  setSubmitDisabled,
}: ProposeRemoveUserType) {
  const theme: any = useTheme();
  const { t } = useTranslation();
  const address = 'address' in selectedOption! ? selectedOption?.address : '';

  useEffect(() => {
    if (address != null) {
      handleSetAddress(new Address(address));
    }
  }, []);

  const queryClient = useQueryClient();
  const removeUserProposals = useMemo(() => {
    const cachedPendingActions = queryClient.getQueryData(QueryKeys.ALL_PENDING_ACTIONS) as MultisigActionDetailed[];
    return cachedPendingActions
      ?.filter((p: MultisigActionDetailed) => p.action instanceof MultisigRemoveUser) ?? [];
  }, [queryClient]);

  const [isAlreadyProposed, setIsAlreadyProposed] = useState(false);

  useEffect(() => {
    if (selectedOption?.option === ProposalsTypes.remove_user) {
      const proposedBech32Addresses = removeUserProposals
        .map((p) => p.action as MultisigRemoveUser)
        .map((a) => a.address.bech32());

      const isProposed = proposedBech32Addresses.includes(address);
      setSubmitDisabled(isProposed);
      setIsAlreadyProposed(isProposed);
    }
  }, [address, queryClient, removeUserProposals, selectedOption, setSubmitDisabled]);

  if (selectedOption === undefined) {
    return null;
  }

  return (
    <div className="modal-control-container">
      {isAlreadyProposed && (
        <Text
          sx={{
            background: '#4c2FFC',
            borderRadius: '4px',
            padding: '8px 10px',
            marginBottom: '16px',
          }}
        >A proposal for removing this address already exists.
        </Text>
      )}
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
