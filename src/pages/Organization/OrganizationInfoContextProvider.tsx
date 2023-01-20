import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Address } from '@multiversx/sdk-core/out';
import { useDispatch, useSelector } from 'react-redux';
import {
  queryBoardMemberAddresses,
  queryQuorumCount,
  queryUserRole,
} from 'src/contracts/MultisigContract';
import {
  currentMultisigContractSelector,
  currentMultisigTransactionIdSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import { uniqueContractAddress } from 'src/multisigConfig';
import { StateType } from 'src/redux/slices/accountGeneralInfoSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { setCurrentMultisigContract } from 'src/redux/slices/multisigContractsSlice';
import { useQuery, useQueryClient } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { parseMultisigAddress } from 'src/utils/addressUtils';
import { setIntervalEndTimestamp } from 'src/redux/slices/transactionsSlice';
import { toastDisappearDelay } from 'src/helpers/constants';
import { removeSignedTransaction } from '@multiversx/sdk-dapp/services';
import {
  useGetAccountInfo,
  useGetLoginInfo,
  useGetPendingTransactions,
  useTrackTransactionStatus,
} from '@multiversx/sdk-dapp/hooks';
import { SignedTransactionsBodyType } from '@multiversx/sdk-dapp/types';
import { OrganizationInfoContextType } from './types';

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const OrganizationInfoContext = createContext<OrganizationInfoContextType>(
  {} as OrganizationInfoContextType,
);

export const useOrganizationInfoContext = () =>
  useContext(OrganizationInfoContext);

function OrganizationInfoContextProvider({ children }: Props) {
  const [quorumCount, setQuorumCount] = useState(0);
  const [userRole, setUserRole] = useState<number>();
  const [membersCount, setMembersCount] = useState(0);
  const [isBoardMember, setIsBoardMember] = useState(false);
  const [boardMembers, setBoardMembers] = useState<Address[]>([]);
  const [isInReadOnlyMode, setIsInReadOnlyMode] = useState<boolean>(true);
  const [isMultiWalletMode, setIsMultiWalletMode] = useState(uniqueContractAddress.length > 0);
  const currentContract = useSelector<StateType, MultisigContractInfoType>(currentMultisigContractSelector);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();

  const fetchMemberDetails = useCallback(async (isMounted: boolean) => {
    if (!currentContract?.address || !isLoggedIn) return;

    const isValidMultisigContract = await ElrondApiProvider.validateMultisigAddress(
      currentContract?.address,
    );

    if (!isValidMultisigContract) return;

    Promise.all([
      queryBoardMemberAddresses(),
      queryQuorumCount(),
    ]).then(
      ([
        boardMembersAddresses,
        quorumCountResponse,
      ]) => {
        if (!isMounted) return;
        setBoardMembers(boardMembersAddresses);
        setQuorumCount(quorumCountResponse);
      },
    );
  }, [currentContract?.address, isLoggedIn]);

  const fetchNftCount = useCallback(
    () => ElrondApiProvider.fetchOrganizationNFTCount(currentContract?.address), [currentContract?.address],
  );

  const {
    data: nftCount,
    refetch: refetchNftCount,
  } = useQuery([QueryKeys.NFT_COUNT],
    fetchNftCount,
    USE_QUERY_DEFAULT_CONFIG,
  );

  useEffect(() => {
    const isSingleWalletMode = (uniqueContractAddress as string).length > 0;
    setIsMultiWalletMode(!isSingleWalletMode);
    if (isSingleWalletMode) {
      const newMultisigAddressParam = parseMultisigAddress(uniqueContractAddress ?? '');
      if (newMultisigAddressParam) { dispatch(setCurrentMultisigContract(newMultisigAddressParam?.bech32())); }
    }
  }, [dispatch]);

  const allMemberAddresses = useMemo(
    () =>
      boardMembers.map((item) => ({ role: 'Board Member', member: item }))
        .map((item, idx) => ({ ...item, id: idx })),
    [boardMembers],
  );

  useEffect(() => {
    setMembersCount(allMemberAddresses.length);
  }, [allMemberAddresses]);

  useEffect(() => {
    if (!address || !isLoggedIn || !currentContract?.address) {
      setUserRole(-1);
      setIsInReadOnlyMode(true);
      return;
    }

    queryUserRole(new Address(address).hex()).then((userRoleResponse) => {
      setUserRole(userRoleResponse);
      setIsInReadOnlyMode(userRole !== 2);
    });
  }, [address, currentContract?.address, dispatch, isLoggedIn, userRole]);

  useEffect(() => {
    setIsInReadOnlyMode(userRole !== 2);
  }, [userRole]);

  useEffect(() => {
    let isMounted = true;
    if (!currentContract?.address) {
      return () => {
        isMounted = false;
      };
    }

    refetchNftCount();
    fetchMemberDetails(isMounted);

    return () => {
      isMounted = false;
    };
  }, [address, currentContract, currentContract?.address, fetchMemberDetails, refetchNftCount]);

  useEffect(() => {
    let isMounted = true;
    if (!address) {
      return () => {
        isMounted = false;
      };
    }

    const boardMembersAddressHex = boardMembers.map((memberAddress) => memberAddress.hex());

    if (isMounted) {
      setIsBoardMember(
        boardMembersAddressHex.includes(new Address(address).hex()),
      );
    }

    return () => {
      isMounted = false;
    };
  }, [address, boardMembers]);

  const currentMultisigTransactionId = useSelector(currentMultisigTransactionIdSelector);

  useTrackTransactionStatus({
    transactionId: currentMultisigTransactionId,
    onTimedOut: () => {
      setTimeout(() => {
        removeSignedTransaction(currentMultisigTransactionId);
      }, toastDisappearDelay);
    },
    onSuccess: () => {
      fetchMemberDetails(true);

      queryClient.invalidateQueries(
        [
          QueryKeys.ADDRESS_EGLD_TOKENS,
          QueryKeys.ADDRESS_ESDT_TOKENS,
          QueryKeys.ALL_ORGANIZATION_NFTS,
          QueryKeys.ALL_TRANSACTIONS_WITH_LOGS_ENABLED,
        ],
      );

      dispatch(setIntervalEndTimestamp(Math.floor(new Date().getTime() / 1000)));
      setTimeout(() => {
        removeSignedTransaction(currentMultisigTransactionId);
      }, toastDisappearDelay);
    },
  });

  const { pendingTransactionsArray } = useGetPendingTransactions();

  useEffect(() => {
    pendingTransactionsArray.forEach((pendingTransaction) => {
      const [sessionId, { transactions }] = pendingTransaction;
      if (transactions
        .every((transaction: SignedTransactionsBodyType) => transaction.status === 'success')) {
        setTimeout(() => removeSignedTransaction(sessionId), toastDisappearDelay);
      }
    });
  }, [pendingTransactionsArray]);

  return (
    <OrganizationInfoContext.Provider
      value={useMemo(() => ({
        membersCountState: [membersCount, setMembersCount],
        boardMembersState: [boardMembers, setBoardMembers],
        boardMembersCount: boardMembers.length,
        quorumCountState: [quorumCount, setQuorumCount],
        userRole: userRole as number,
        allMemberAddresses,
        isBoardMemberState: [isBoardMember, setIsBoardMember],
        nftCount: nftCount ?? 0,
        isMultiWalletMode,
        isInReadOnlyMode,
      }),
      [
        membersCount,
        boardMembers,
        quorumCount,
        userRole,
        allMemberAddresses,
        isBoardMember,
        nftCount,
        isMultiWalletMode,
        isInReadOnlyMode,
      ])}
    >
      {children}
    </OrganizationInfoContext.Provider>
  );
}

export default OrganizationInfoContextProvider;
