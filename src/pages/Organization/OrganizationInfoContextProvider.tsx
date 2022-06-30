import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import { useSelector } from 'react-redux';
import { network } from 'config';
import {
  queryBoardMemberAddresses,
  queryProposerAddresses,
  queryQuorumCount,
  queryUserRole
} from 'contracts/MultisigContract';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import useFetch from 'utils/useFetch';
import { OrganizationInfoContextType, TokenWithPrice } from './types';

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const OrganizationInfoContext = createContext<OrganizationInfoContextType>(
  {} as OrganizationInfoContextType
);

export const useOrganizationInfoContext = () =>
  useContext(OrganizationInfoContext);

function OrganizationInfoContextProvider({ children }: Props) {
  const [membersCount, setMembersCount] = useState(0);
  const [quorumCount, setQuorumCount] = useState(0);

  const [boardMembers, setBoardMembers] = useState([] as Address[]);
  const [proposers, setProposers] = useState([] as Address[]);
  const [isBoardMember, setIsBoardMember] = useState(false);

  const { address } = useGetAccountInfo();

  const { data: tokenPrices }: { data: TokenWithPrice[] | undefined } =
    useFetch(`${network.apiAddress}/mex/tokens`);

  const currentContract = useSelector(currentMultisigContractSelector);

  const allMemberAddresses = useMemo(
    () =>
      [
        ...boardMembers.map((item) => ({ role: 'Board Member', member: item })),
        ...proposers.map((item) => ({ role: 'Proposer', member: item }))
      ].map((item, idx) => ({ ...item, id: idx })),
    [boardMembers, proposers]
  );

  useEffect(() => {
    setMembersCount(allMemberAddresses.length);
  }, [allMemberAddresses]);

  const [userRole, setUserRole] = useState<number>();

  useEffect(() => {
    let isMounted = true;
    if (!currentContract?.address && address) {
      return () => {
        isMounted = false;
      };
    }

    currentContract?.address &&
      address &&
      Promise.all([
        queryBoardMemberAddresses(),
        queryUserRole(new Address(address).hex()),
        queryProposerAddresses(),
        queryQuorumCount()
      ]).then(
        ([
          boardMembersAddresses,
          userRoleResponse,
          proposersAddresses,
          quorumCountResponse
        ]) => {
          if (!isMounted) return;
          setBoardMembers(boardMembersAddresses);
          setProposers(proposersAddresses);
          setQuorumCount(quorumCountResponse);
          setUserRole(userRoleResponse);
        }
      );
    return () => {
      isMounted = false;
    };
  }, [currentContract, currentContract?.address]);

  useEffect(() => {
    if (!address) return;
    const boardMembersAddressHex = boardMembers.map((memberAddress) =>
      memberAddress.hex()
    );

    boardMembers.forEach((a) => console.log(a.bech32()));
    console.log(
      'search for ',
      new Address(address).hex(),
      ' in ',
      boardMembersAddressHex
    );

    setIsBoardMember(
      boardMembersAddressHex.includes(new Address(address).hex())
    );
  }, [address, boardMembers]);

  return (
    <OrganizationInfoContext.Provider
      value={{
        membersCountState: [membersCount, setMembersCount],
        boardMembersState: [boardMembers, setBoardMembers],
        quorumCountState: [quorumCount, setQuorumCount],
        proposersState: [proposers, setProposers],
        userRole: userRole as number,
        tokenPrices: tokenPrices as unknown as TokenWithPrice[],
        allMemberAddresses,
        isBoardMemberState: [isBoardMember, setIsBoardMember]
      }}
    >
      {children}
    </OrganizationInfoContext.Provider>
  );
}

export default OrganizationInfoContextProvider;
