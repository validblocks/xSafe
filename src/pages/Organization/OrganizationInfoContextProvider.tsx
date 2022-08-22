import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import { useDispatch, useSelector } from 'react-redux';
import {
  queryBoardMemberAddresses,
  queryProposerAddresses,
  queryQuorumCount,
  queryUserRole,
} from 'src/contracts/MultisigContract';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useQuery } from 'react-query';
import axios from 'axios';
import { setConversionRates } from 'src/redux/slices/currencySlice';
import { conversionRatesSelector } from 'src/redux/selectors/currencySelector';
import { OrganizationInfoContextType } from './types';

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const CONVERSION_API_BASE_URL = 'https://api.frankfurter.app/latest';

const OrganizationInfoContext = createContext<OrganizationInfoContextType>(
  {} as OrganizationInfoContextType,
);

export const useOrganizationInfoContext = () =>
  useContext(OrganizationInfoContext);

function OrganizationInfoContextProvider({ children }: Props) {
  const [proposers, setProposers] = useState<Address[]>([]);
  const [quorumCount, setQuorumCount] = useState(0);
  const [membersCount, setMembersCount] = useState(0);
  const [boardMembers, setBoardMembers] = useState<Address[]>([]);
  const [isBoardMember, setIsBoardMember] = useState(false);

  const dispatch = useDispatch();
  const { address } = useGetAccountInfo();
  const supportedCurrencies = useSelector(conversionRatesSelector);
  const currentContract = useSelector(currentMultisigContractSelector);
  const currencyQueryParam = useMemo(() => Object.keys(supportedCurrencies).join(','), [supportedCurrencies]);

  const {
    data: fetchedConversionRates,
  } = useQuery(
    ['currencyRates'],
    () => axios.get(`${CONVERSION_API_BASE_URL}?from=USD&to=${currencyQueryParam}`)
      .then((resp) => resp.data),
  );

  useEffect(() => {
    if (!fetchedConversionRates) return;
    dispatch(setConversionRates(fetchedConversionRates.rates));
  }, [dispatch, fetchedConversionRates]);

  const allMemberAddresses = useMemo(
    () =>
      [
        ...boardMembers.map((item) => ({ role: 'Board Member', member: item })),
        ...proposers.map((item) => ({ role: 'Proposer', member: item })),
      ].map((item, idx) => ({ ...item, id: idx })),
    [boardMembers, proposers],
  );

  useEffect(() => {
    setMembersCount(allMemberAddresses.length);
  }, [allMemberAddresses]);

  const [userRole, setUserRole] = useState<number>();

  useEffect(() => {
    let isMounted = true;
    if (!address || !currentContract?.address) {
      return () => {
        isMounted = false;
      };
    }

    (() =>
      currentContract?.address &&
    currentContract?.address &&
      address &&
      Promise.all([
        queryBoardMemberAddresses(),
        queryUserRole(new Address(address).hex()),
        queryProposerAddresses(),
        queryQuorumCount(),
      ]).then(
        ([
          boardMembersAddresses,
          userRoleResponse,
          proposersAddresses,
          quorumCountResponse,
        ]) => {
          if (!isMounted) return;
          setBoardMembers(boardMembersAddresses);
          setProposers(proposersAddresses);
          setQuorumCount(quorumCountResponse);
          setUserRole(userRoleResponse);
        },
      ))();
    return () => {
      isMounted = false;
    };
  }, [address, currentContract, currentContract?.address]);

  useEffect(() => {
    let isMounted = true;
    if (!address) {
      return () => {
        isMounted = false;
      };
    }

    const boardMembersAddressHex = boardMembers.map((memberAddress) =>
      memberAddress.hex(),
    );

    if (isMounted) {
      setIsBoardMember(
        boardMembersAddressHex.includes(new Address(address).hex()),
      );
    }

    return () => {
      isMounted = false;
    };
  }, [address, boardMembers]);

  return (
    <OrganizationInfoContext.Provider
      value={useMemo(() => ({
        membersCountState: [membersCount, setMembersCount],
        boardMembersState: [boardMembers, setBoardMembers],
        quorumCountState: [quorumCount, setQuorumCount],
        proposersState: [proposers, setProposers],
        userRole: userRole as number,
        allMemberAddresses,
        isBoardMemberState: [isBoardMember, setIsBoardMember],
      }),
      [membersCount, boardMembers, quorumCount, proposers, userRole, allMemberAddresses, isBoardMember])}
    >
      {children}
    </OrganizationInfoContext.Provider>
  );
}

export default OrganizationInfoContextProvider;
