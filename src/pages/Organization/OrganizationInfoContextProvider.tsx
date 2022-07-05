import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import { useSelector } from 'react-redux';
import {
  queryBoardMemberAddresses,
  queryProposerAddresses,
  queryQuorumCount,
  queryUserRole,
} from 'src/contracts/MultisigContract';
import useFetch from 'src/utils/useFetch';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { OrganizationInfoContextType, TokenWithPrice } from './types';

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const OrganizationInfoContext = createContext<OrganizationInfoContextType>(
  {} as OrganizationInfoContextType,
);

export const useOrganizationInfoContext = () =>
  useContext(OrganizationInfoContext);

const OrganizationInfoContextProvider = ({ children }: Props) => {
  const [membersCount, setMembersCount] = useState(0);
  const [quorumCount, setQuorumCount] = useState(0);

  const [boardMembers, setBoardMembers] = useState([] as Address[]);
  const [proposers, setProposers] = useState([] as Address[]);

  const { address } = useGetAccountInfo();

  const { data: tokenPrices }: { data: TokenWithPrice[] | undefined } =
    useFetch('https://devnet-api.elrond.com/mex/tokens');

  const currentContract = useSelector(currentMultisigContractSelector);

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
  }, []);

  return (
    <OrganizationInfoContext.Provider
      value={useMemo(() => ({
        membersCountState: [membersCount, setMembersCount],
        boardMembersState: [boardMembers, setBoardMembers],
        quorumCountState: [quorumCount, setQuorumCount],
        proposersState: [proposers, setProposers],
        userRole: userRole as number,
        tokenPrices: tokenPrices as unknown as TokenWithPrice[],
        allMemberAddresses,
      }), [membersCount, boardMembers, quorumCount, proposers, userRole, tokenPrices, allMemberAddresses])}
    >
      {children}
    </OrganizationInfoContext.Provider>
  );
};

export default OrganizationInfoContextProvider;
