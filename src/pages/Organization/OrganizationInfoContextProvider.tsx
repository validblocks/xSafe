import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { transactionServices, useGetAccountInfo, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs/out';
import { useDispatch, useSelector } from 'react-redux';
import { setSafeName } from 'src/redux/slices/safeNameSlice';
import {
  queryBoardMemberAddresses,
  queryQuorumCount,
  queryUserRole,
} from 'src/contracts/MultisigContract';
import {
  currentMultisigContractSelector,
  currentMultisigTransactionIdSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import { uniqueContractAddress, uniqueContractName } from 'src/multisigConfig';
import { safeNameStoredSelector } from 'src/redux/selectors/safeNameSelector';
import { StateType } from 'src/redux/slices/accountSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { setCurrentMultisigContract } from 'src/redux/slices/multisigContractsSlice';
import { useQuery, useQueryClient } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { OrganizationInfoContextType } from './types';

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const OrganizationInfoContext = createContext<OrganizationInfoContextType>(
  {} as OrganizationInfoContextType,
);

const parseMultisigAddress = (addressParam: string): Address | null => {
  try {
    return new Address(addressParam);
  } catch {
    return null;
  }
};

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

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();
  const safeName = useSelector(safeNameStoredSelector);

  useEffect(() => {
    dispatch(setSafeName(uniqueContractName?.length > 0 ? uniqueContractName : safeName));
  }, [dispatch, safeName, uniqueContractName]);

  const currentContract = useSelector<StateType, MultisigContractInfoType>(currentMultisigContractSelector);

  const fetchNftCount = useCallback(
    () => ElrondApiProvider.fetchOrganizationNFTCount(currentContract?.address), [currentContract?.address],
  );

  const {
    data: nftCount,
    refetch: refetchNftCount,
  } = useQuery(['NFT_COUNT'],
    fetchNftCount,
    {
      ...USE_QUERY_DEFAULT_CONFIG,
    },
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
      [
        ...boardMembers.map((item) => ({ role: 'Board Member', member: item })),
      ].map((item, idx) => ({ ...item, id: idx })),
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

    return () => {
      isMounted = false;
    };
  }, [address, currentContract, currentContract?.address, refetchNftCount]);

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

  const currentMultisigTransactionId = useSelector(currentMultisigTransactionIdSelector);

  transactionServices.useTrackTransactionStatus({
    transactionId: currentMultisigTransactionId,
    onSuccess: () => {
      queryClient.invalidateQueries(
        [
          QueryKeys.ADDRESS_EGLD_TOKENS,
          QueryKeys.ADDRESS_ESDT_TOKENS,
          QueryKeys.ALL_ORGANIZATION_NFTS,
        ],
      );
    },
  });

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
      [membersCount, boardMembers, quorumCount, userRole, allMemberAddresses, isBoardMember, nftCount])}
    >
      {children}
    </OrganizationInfoContext.Provider>
  );
}

export default OrganizationInfoContextProvider;
