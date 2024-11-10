import { useQuery } from 'react-query';
import { useCallback, useMemo } from 'react';
import { useAddressBook } from './useAddressBook';
import { AccountInfo, MultisigMember } from 'src/types/organization';
import { queryBoardMemberAddresses } from 'src/contracts/MultisigContract';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';

const fetchMultisigMembers = async (): Promise<MultisigMember[]> => {
  const members = await queryBoardMemberAddresses();
  const accountDataPromises = members.map((address) =>
    MultiversxApiProvider.getAccountData(address.bech32()),
  );
  const accountsData = await Promise.all(accountDataPromises);
  return accountsData;
};

export const useMultisigMembers = () => {
  const addressBook = useAddressBook();

  const addHerotagAndName = useCallback(
    ({ address, username }: AccountInfo): MultisigMember => ({
      address,
      ...(!!username && {
        herotag: username,
      }),
      ...(!!addressBook[address] && {
        name: addressBook[address],
      }),
    }),
    [addressBook],
  );

  const { data: multisigMemberAddresses = [], isLoading: _ } = useQuery(
    'multisigMembers',
    fetchMultisigMembers,
  );

  const multisigMembers = useMemo(
    () => multisigMemberAddresses.map(addHerotagAndName),
    [addHerotagAndName, multisigMemberAddresses],
  );

  return multisigMembers;
};
