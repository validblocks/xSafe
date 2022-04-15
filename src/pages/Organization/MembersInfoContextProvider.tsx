import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { operations } from '@elrondnetwork/dapp-utils';
import { Address, Transaction } from '@elrondnetwork/erdjs/out';
import { current } from '@reduxjs/toolkit';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { denomination, decimals } from 'config';
import {
  queryBoardMemberAddresses,
  queryProposerAddresses,
  queryQuorumCount
} from 'contracts/MultisigContract';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';

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

  const currentContract = useSelector(currentMultisigContractSelector);

  const allMemberAddresses = useMemo(() => {
    return [
      ...boardMembers.map((item) => ({ role: 'Board Member', member: item })),
      ...proposers.map((item) => ({ role: 'Proposer', member: item }))
    ].map((item, idx) => ({ ...item, id: idx }));
  }, [boardMembers, proposers]);

  useEffect(() => {
    setMembersCount(allMemberAddresses.length);
    // for (const address of allMemberAddresses) {
    //   console.log({ address });
    //   proxy
    //     .getAccount(
    //       new Address(
    //         'erd1qqqqqqqqqqqqqpgqettaulcsh6afs9h4mhsv44lu28p0rezehdeqk7nttw'
    //       )
    //     )
    //     .then((resp: any) => console.log({ resp }));
    // }
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
        console.log({ currentContract });
        axios
          .get(
            `https://devnet-api.elrond.com/accounts/${currentContract?.address}/transactions`
          )
          .then(({ data }) => {
            const values = data
              .filter((transaction: any) => transaction.value != 0)
              .map(({ value, sender, receiver }: any) => ({
                value: parseFloat(
                  operations.denominate({
                    input: value,
                    denomination,
                    decimals,
                    showLastNonZeroDecimal: true
                  })
                ),
                sender,
                receiver
              }))
              .reduce(
                (contributionOf: any, { sender, receiver, value }: any) => {
                  if (!contributionOf[sender]) contributionOf[sender] = 0;

                  if (receiver == currentContract?.address) {
                    contributionOf[sender] += value;
                    contributionOf.total += value;
                  }

                  if (sender == currentContract?.address) {
                    contributionOf[sender] -= value;
                  }
                  return contributionOf;
                },
                { total: 0 }
              );

            console.log({ values });
          });
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
