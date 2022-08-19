import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import { useSelector } from 'react-redux';
import { network } from 'src/config';
import {
  queryBoardMemberAddresses,
  queryProposerAddresses,
  queryQuorumCount,
  queryUserRole,
} from 'src/contracts/MultisigContract';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { QueryKeys } from 'src/react-query/queryKeys';
import { useQuery } from 'react-query';
import axios from 'axios';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { OrganizationInfoContextType, TokenWithPrice } from './types';

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const OrganizationInfoContext = createContext<OrganizationInfoContextType>(
  {} as OrganizationInfoContextType,
);

export const useOrganizationInfoContext = () =>
  useContext(OrganizationInfoContext);

function OrganizationInfoContextProvider({ children }: Props) {
  const [membersCount, setMembersCount] = useState(0);
  const [quorumCount, setQuorumCount] = useState(0);

  const [boardMembers, setBoardMembers] = useState([] as Address[]);
  const [proposers, setProposers] = useState([] as Address[]);
  const [isBoardMember, setIsBoardMember] = useState(false);
  const currentContract = useSelector(currentMultisigContractSelector);

  const { address } = useGetAccountInfo();

  const {
    data: tokenPrices,
  } = useQuery(
    [
      QueryKeys.TOKEN_PRICES,
    ],
    () => axios.get(`${network.apiAddress}/mex/tokens`).then((res) => res.data),
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true,
    },
  );

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
        tokenPrices: tokenPrices as unknown as TokenWithPrice[],
        allMemberAddresses,
        isBoardMemberState: [isBoardMember, setIsBoardMember],
      }),
      [membersCount, boardMembers, quorumCount, proposers, userRole, tokenPrices, allMemberAddresses, isBoardMember])}
    >
      {children}
    </OrganizationInfoContext.Provider>
  );
}

export default OrganizationInfoContextProvider;
