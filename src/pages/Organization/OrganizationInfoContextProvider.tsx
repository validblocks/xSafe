import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import {
  queryBoardMemberAddresses,
  queryProposerAddresses,
  queryQuorumCount,
  queryUserRole
} from 'contracts/MultisigContract';

type MemberAddressTableRow = { id: number; role: string; member: Address };

type CustomStateType<InnerType> = [
  value: InnerType,
  setValue: React.Dispatch<React.SetStateAction<InnerType>>
];

type OrganizationInfoContextType = {
  membersCountState: CustomStateType<number>;
  quorumCountState: CustomStateType<number>;
  boardMembersState: CustomStateType<Address[]>;
  proposersState: CustomStateType<Address[]>;
  allMemberAddresses: MemberAddressTableRow[];
  userRole: number;
};

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
        allMemberAddresses
      }}
    >
      {children}
    </OrganizationInfoContext.Provider>
  );
};

export default OrganizationInfoContextProvider;
