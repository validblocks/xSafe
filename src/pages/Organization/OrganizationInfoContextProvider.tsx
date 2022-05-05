import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { getNetworkProxy } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { network } from 'config';
import {
  queryBoardMemberAddresses,
  queryProposerAddresses,
  queryQuorumCount,
  queryUserRole
} from 'contracts/MultisigContract';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import { OrganizationInfoContextType, TokenTableRow } from './types';

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const OrganizationInfoContext = createContext<OrganizationInfoContextType>(
  {} as OrganizationInfoContextType
);

export const useOrganizationInfoContext = () =>
  useContext(OrganizationInfoContext);

const OrganizationInfoContextProvider = ({ children }: Props) => {
  const [membersCount, setMembersCount] = useState(0);
  const [quorumCount, setQuorumCount] = useState(0);

  const [boardMembers, setBoardMembers] = useState([] as Address[]);
  const [proposers, setProposers] = useState([] as Address[]);

  const { address } = useGetAccountInfo();
  const [organizationTokens, setOrganizationTokens] = useState(
    [] as TokenTableRow[]
  );

  const currentContract = useSelector(currentMultisigContractSelector);
  const proxy = getNetworkProxy();

  const allMemberAddresses = useMemo(() => {
    return [
      ...boardMembers.map((item) => ({ role: 'Board Member', member: item })),
      ...proposers.map((item) => ({ role: 'Proposer', member: item }))
    ].map((item, idx) => ({ ...item, id: idx }));
  }, [boardMembers, proposers]);

  useEffect(() => {
    setMembersCount(allMemberAddresses.length);
  }, [allMemberAddresses]);

  const [userRole, setUserRole] = useState<number>();

  useEffect(() => {
    const getEgldBalancePromise = proxy.getAccount(
      new Address(currentContract?.address)
    );
    const getAllOtherTokensPromise = axios.get(
      `${network.apiAddress}/accounts/${currentContract?.address}/tokens`
    );
    Promise.all([getEgldBalancePromise, getAllOtherTokensPromise]).then(
      ([{ balance: egldBalance }, { data: otherTokens }]) => {
        const allTokens = [
          { ...egldBalance.token, balance: egldBalance.value.toString() },
          ...otherTokens
        ];
        setOrganizationTokens(
          allTokens.map((token: any, idx: number) => ({
            ...token,
            id: idx,
            balance: {
              amount: token.balance,
              decimals: token.decimals
            },
            value: {
              amount: token.balance,
              decimals: token.decimals
            }
          }))
        );
      }
    );
  }, []);

  useEffect(() => {
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
        setBoardMembers(boardMembersAddresses);
        setProposers(proposersAddresses);
        setQuorumCount(quorumCountResponse);
        setUserRole(userRoleResponse);
      }
    );
  }, []);

  return (
    <OrganizationInfoContext.Provider
      value={{
        membersCountState: [membersCount, setMembersCount],
        boardMembersState: [boardMembers, setBoardMembers],
        quorumCountState: [quorumCount, setQuorumCount],
        proposersState: [proposers, setProposers],
        userRole: userRole as number,
        tokensState: organizationTokens,
        allMemberAddresses
      }}
    >
      {children}
    </OrganizationInfoContext.Provider>
  );
};

export default OrganizationInfoContextProvider;
