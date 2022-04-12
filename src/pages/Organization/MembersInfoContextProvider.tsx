import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import {
  queryBoardMemberAddresses,
  queryProposerAddresses,
  queryQuorumCount
} from 'contracts/MultisigContract';

type MemberAddressTableRow = { id: number; role: string; member: Address };

type CustomStateType<InnerType> = [
  value: InnerType,
  setValue: React.Dispatch<React.SetStateAction<InnerType>>
];

type MembersInfoContextType = {
  membersCountState: CustomStateType<number>;
  quorumCountState: CustomStateType<number>;
  boardMembersState: CustomStateType<Address[]>;
  proposersState: CustomStateType<Address[]>;
  allMemberAddresses: MemberAddressTableRow[];
};

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const MembersInfoContext = createContext<MembersInfoContextType>(
  {} as MembersInfoContextType
);

export const useMembersInfoContext = () => useContext(MembersInfoContext);

const MembersInfoContextProvider = ({ children }: Props) => {
  const [membersCount, setMembersCount] = useState(0);
  const [quorumCount, setQuorumCount] = useState(0);

  const [boardMembers, setBoardMembers] = useState([] as Address[]);
  const [proposers, setProposers] = useState([] as Address[]);

  const allMemberAddresses = useMemo(() => {
    return [
      ...boardMembers.map((item) => ({ role: 'Board Member', member: item })),
      ...proposers.map((item) => ({ role: 'Proposer', member: item }))
    ].map((item, idx) => ({ ...item, id: idx }));
  }, [boardMembers, proposers]);

  useEffect(() => {
    setMembersCount(allMemberAddresses.length);
  }, [allMemberAddresses]);

  useEffect(() => {
    Promise.all([
      queryBoardMemberAddresses(),
      queryProposerAddresses(),
      queryQuorumCount()
    ]).then(
      ([boardMembersAddresses, proposersAddresses, quorumCountResponse]) => {
        setBoardMembers(boardMembersAddresses);
        setProposers(proposersAddresses);
        setQuorumCount(quorumCountResponse);
      }
    );
  }, []);

  return (
    <MembersInfoContext.Provider
      value={{
        membersCountState: [membersCount, setMembersCount],
        boardMembersState: [boardMembers, setBoardMembers],
        quorumCountState: [quorumCount, setQuorumCount],
        proposersState: [proposers, setProposers],
        allMemberAddresses
      }}
    >
      {children}
    </MembersInfoContext.Provider>
  );
};

export default MembersInfoContextProvider;
