import { useMemo } from 'react';
import { Address, Balance } from '@elrondnetwork/erdjs';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import ReceiveModal from 'src/components/ReceiveModal';
import {
  currentMultisigContractSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import MultisigDetailsAccordion from './MultisigDetailsAccordion';
import { useOrganizationInfoContext } from '../Organization/OrganizationInfoContextProvider';

export interface ContractInfo {
  totalBoardMembers: number;
  totalProposers: number;
  quorumSize: number;
  deployedAt?: string;
  userRole: number;
  allActions: MultisigActionDetailed[];
  multisigBalance: Balance;
  multisigName?: string;
  boardMembersAddresses?: Address[];
  proposersAddresses?: Address[];
}
function MultisigDetailsPage() {
  const currentContract = useSelector(currentMultisigContractSelector);

  const {
    boardMembersCount: totalBoardMembers,
    quorumCountState: [quorumSize],
    userRole,
  } = useOrganizationInfoContext();

  const { multisigAddressParam } = useParams<string>();
  const { t }: { t: any } = useTranslation();

  // async function getDashboardInfo() {
  //   if (currentContract == null) {
  //     return;
  //   }
  //   const proxy = getNetworkProxy();
  //   try {
  //     const [
  //       newTotalBoardMembers,
  //       newTotalProposers,
  //       newQuorumSize,
  //       newUserRole,
  //       newAllActions,
  //       account,
  //       boardMembersAddresses,
  //       proposersAddresses,
  //     ] = await Promise.all([
  //       queryBoardMembersCount(),
  //       queryProposersCount(),
  //       queryQuorumCount(),
  //       queryUserRole(new Address(address).hex()),
  //       queryAllActions(),
  //       proxy.getAccount(new Address(currentContract.address)),
  //       queryBoardMemberAddresses(),
  //       queryProposerAddresses(),
  //     ]);
  //     const accountInfo = await ElrondApiProvider.getAccountData(currentContract.address);
  //     const newContractInfo: ContractInfo = {
  //       totalBoardMembers: newTotalBoardMembers,
  //       totalProposers: newTotalProposers,
  //       quorumSize: newQuorumSize,
  //       userRole: newUserRole,
  //       deployedAt: moment.unix(accountInfo.deployedAt).format('DD MMM YYYY'),
  //       allActions: newAllActions,
  //       multisigBalance: account.balance,
  //       boardMembersAddresses,
  //       proposersAddresses,
  //     };

  //     setContractInfo(newContractInfo);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate(routeNames.unlock);
  //   }
  // }, [isLoggedIn, navigate]);

  // useEffect(() => {
  //   if (!currentContract) return;

  //   console.log('aaaa');

  // const tryParseUrlParams = async () => {
  //   const parameters = await tryParseTransactionParameter(apiAddress);
  //   if (parameters === null) {
  //     return;
  //   }

  //   if (parameters.receiver.bech32() === currentContract?.address) {
  //     if (parameters.functionName.startsWith('propose')) {
  //       if (
  //         parameters.outputParameters.length === 2 &&
  //         hexToString(parameters.outputParameters[0]) === 'ok'
  //       ) {
  //         const actionId = hexToNumber(parameters.outputParameters[1]);
  //         if (actionId !== null) {
  //           onSignOrPropose(actionId);
  //         }
  //       }
  //     } else if (parameters.functionName === 'sign') {
  //       if (
  //         parameters.outputParameters.length === 1 &&
  //         hexToString(parameters.outputParameters[0]) === 'ok'
  //       ) {
  //         const actionId = hexToNumber(parameters.inputParameters[0]);
  //         if (actionId !== null) {
  //           onSignOrPropose(actionId);
  //         }
  //       }
  //     } else if (parameters.functionName === 'unsign') {
  //       if (
  //         parameters.outputParameters.length === 1 &&
  //         hexToString(parameters.outputParameters[0]) === 'ok'
  //       ) {
  //         const actionId = hexToNumber(parameters.inputParameters[0]);
  //         if (actionId !== null) {
  //           onUnsign(actionId);
  //         }
  //       }
  //     }
  //   }
  // };

  // tryParseUrlParams();
  //   const parseMultisigAddress = (addressParam: string): Address | null => {
  //     try {
  //       return new Address(addressParam);
  //     } catch {
  //       return null;
  //     }
  //   };

  //   const newMultisigAddressParam = parseMultisigAddress(multisigAddressParam ?? '');
  //   if (newMultisigAddressParam === null) {
  //     return;
  //   }

  //   const isCurrentMultisigAddressNotSet = currentContract == null;
  //   const isCurrentMultisigAddressDiferentThanParam =
  //     newMultisigAddressParam != null &&
  //     currentContract?.address !== newMultisigAddressParam.bech32();

  //   if (
  //     (isCurrentMultisigAddressNotSet ||
  //       isCurrentMultisigAddressDiferentThanParam) &&
  //     newMultisigAddressParam != null
  //   ) {
  //     console.log('updating current multsig contract');
  //     dispatch(setCurrentMultisigContract(newMultisigAddressParam.bech32()));
  //   } else {
  //     console.log('calling getDashboardInfo');
  //     getDashboardInfo();
  //   }
  // }, [currentContract?.address, currentMultisigTransactionId, address, currentContract, multisigAddressParam]);

  const userRoleAsString = useMemo(() => {
    switch (userRole) {
      case 0:
        return 'No rights';
      case 1:
        return 'Proposer';
      case 2:
        return 'Board Member (Propose and Sign)';
      default:
        return 'Not logged in';
    }
  }, [userRole]);

  const parseMultisigAddress = (addressParam: string): Address | null => {
    try {
      return new Address(addressParam);
    } catch {
      return null;
    }
  };

  const contractInfo = useMemo(() => ({
    totalBoardMembers,
    quorumSize,
  }), [quorumSize, totalBoardMembers]);

  if (!parseMultisigAddress(multisigAddressParam ?? '')) {
    return <Navigate to="/multisig" />;
  }

  return (
    <div className="dashboard w-100">
      <div className="card shadow-lg border-0">
        <div className="flex-column d-flex align-items-center">
          <div className="w-100 user-profile">
            <div className="d-flex profile-meta align-items-center">
              <div className="user-role d-flex align-items-center">
                <Text>
                  <PersonRoundedIcon />
                  Role:
                  {' '}
                  <span className="text">{t(userRoleAsString)}</span>
                </Text>
              </div>

            </div>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center action-panel w-100">

            <div className="d-flex justify-content-center">
              <ReceiveModal address={currentContract?.address} />
            </div>
          </div>
        </div>

        <MultisigDetailsAccordion
          contractInfo={contractInfo}
        />

      </div>
    </div>
  );
}

export default MultisigDetailsPage;
