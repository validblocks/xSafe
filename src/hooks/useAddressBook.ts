import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';
import { AddressBook } from 'src/types/organization';
import { useMemo } from 'react';

export const useAddressBook = (): AddressBook => {
  const addressBook = useSelector<RootState, AddressBook>(addressBookSelector);

  return useMemo(() => addressBook, [addressBook]);
};
