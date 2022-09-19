import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as AssetActionIcon } from 'src/assets/img/arrow-back-sharp.svg';
import ReceiveModal from 'src/components/ReceiveModal';
import AmountWithTitleCard from 'src/components/Utils/AmountWithTitleCard';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { organizationTokensSelector, totalUsdValueSelector } from 'src/redux/selectors/accountSelector';
import { selectedCurrencySelector } from 'src/redux/selectors/currencySelector';
import routeNames from 'src/routes/routeNames';
import * as Styled from 'src/pages/MultisigDetails/styled';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useNavigate } from 'react-router-dom';
import { setProposeMultiselectSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import useCurrencyConversion from './useCurrencyConversion';

export default function useMultisigDetailsCards() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getCurrency = useSelector(selectedCurrencySelector);
  const totalUsdValue = useSelector(totalUsdValueSelector);
  const currentContract = useSelector(currentMultisigContractSelector);
  const { t }: { t: any } = useTranslation();
  const organizationTokens = useSelector(organizationTokensSelector);
  const totalUsdValueConverted = useCurrencyConversion(totalUsdValue);

  const [organizatonAssets, setOrganizationAssets] = useState({
    tokens: 0,
  });
  const [
    totalOrganizationValueToDisplay,
    setTotalOrganizationValueToDisplay,
  ] = useState('0');

  const {
    boardMembersCount: totalBoardMembers,
    quorumCountState: [quorumSize],
    userRole,
    nftCount,
    isInReadOnlyMode,
  } = useOrganizationInfoContext();

  const contractInfo = useMemo(() => ({
    totalBoardMembers,
    quorumSize,
  }), [quorumSize, totalBoardMembers]);

  const userRoleAsString = useMemo(() => {
    switch (userRole) {
      case 0:
        return 'No rights';
      case 2:
        return 'Board Member';
      default:
        return 'Not logged in';
    }
  }, [userRole]);

  const userRoleDescriptions = useMemo(() => ({
    'No rights': 'You have no rights',
    'Board Member': 'Propose and sign',
    'Not logged in': 'Login to propose',
  }), []);

  useEffect(() => {
    setOrganizationAssets(
      (assets) => ({ ...assets, tokens: organizationTokens?.length ?? 0 }),
    );
  }, [organizationTokens, currentContract?.address]);

  useEffect(() => {
    const value = Number(parseFloat(totalUsdValueConverted.toFixed(2))).toLocaleString();
    setTotalOrganizationValueToDisplay(value);
  }, [totalUsdValueConverted]);

  const userRoleDescription = useMemo(
    () => userRoleDescriptions[userRoleAsString],
    [userRoleAsString, userRoleDescriptions],
  );

  const onNewTransactionClick = useCallback(() =>
    dispatch(
      setProposeMultiselectSelectedOption({
        option: ProposalsTypes.multiselect_proposal_options,
      }),
    ), [dispatch]);

  const topSectionCards = useMemo(
    () => [
      <AmountWithTitleCard
        needsDollarSign={false}
        amountValue={''}
        amountUnityMeasure={t(userRoleAsString)}
        title={'Your Role'}
        actionButton={(
          <Styled.CardButton
            disabled={isInReadOnlyMode}
            onClick={onNewTransactionClick}
          >
            <AssetActionIcon width="25px" height="25px" /> {userRoleDescription}
          </Styled.CardButton>
        )}
      />,
      <AmountWithTitleCard
        needsDollarSign={false}
        amountValue={totalOrganizationValueToDisplay}
        amountUnityMeasure={getCurrency}
        actionButton={
          <ReceiveModal showQrFromCard address={currentContract?.address} />
        }
        title={'Organization Funds'}
      />,
    ],
    [currentContract?.address, getCurrency, isInReadOnlyMode, onNewTransactionClick, t, totalOrganizationValueToDisplay, userRoleAsString, userRoleDescription],
  );

  const bottomSectionCards = useMemo(
    () => [
      <AmountWithTitleCard
        needsDollarSign={false}
        amountValue={organizatonAssets?.tokens?.toString()}
        amountUnityMeasure={'Tokens'}
        title={'Organization Tokens'}
        actionButton={(
          <Styled.CardButton
            onClick={() => navigate(routeNames.assets)}
          >
            <AssetActionIcon width="25px" height="25px" /> View Coins
          </Styled.CardButton>
        )}
      />,
      <AmountWithTitleCard
        needsDollarSign={false}
        amountValue={nftCount.toString()}
        amountUnityMeasure={'NFTs'}
        actionButton={(
          <Styled.CardButton
            onClick={() => navigate(routeNames.nft)}
          >
            <AssetActionIcon width="25px" height="25px" /> View NFTs
          </Styled.CardButton>
        )}
        title={'Organization NFTs'}
      />,
      <AmountWithTitleCard
        needsDollarSign={false}
        amountValue={contractInfo.totalBoardMembers.toString() ?? '0'}
        amountUnityMeasure={'Owners'}
        actionButton={(
          <Styled.CardButton
            key="0"
            variant="outlined"
            className="shadow-sm rounded mr-2"
            onClick={() => navigate(routeNames.owners)}
          >
            <AssetActionIcon width="25px" height="25px" /> View Owners
          </Styled.CardButton>
        )}
        title={'Organization Owners'}
      />,
      <AmountWithTitleCard
        needsDollarSign={false}
        amountValue={`${contractInfo.quorumSize?.toString() ?? '0'}/${
          contractInfo.totalBoardMembers
        } `}
        amountUnityMeasure={'Owners'}
        actionButton={(
          <Styled.CardButton
            key="0"
            variant="outlined"
            className="shadow-sm rounded mr-2"
            onClick={() => navigate(routeNames.cvorum)}
          >
            <AssetActionIcon width="25px" height="25px" /> View Quorum
          </Styled.CardButton>
        )}
        title={'Organization Quorum'}
      />,
    ],
    [
      contractInfo.quorumSize,
      contractInfo.totalBoardMembers,
      navigate,
      nftCount,
      organizatonAssets?.tokens,
    ],
  );

  return {
    topSectionCards,
    bottomSectionCards,
  };
}
