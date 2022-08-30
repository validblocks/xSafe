import { useEffect, useMemo, useState } from 'react';
import { Address, Balance } from '@elrondnetwork/erdjs';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as AssetActionIcon } from 'src/assets/img/arrow-back-sharp.svg';
import ReceiveModal from 'src/components/ReceiveModal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  currentMultisigContractSelector,
} from 'src/redux/selectors/multisigContractsSelectors';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { organizationTokensSelector, totalUsdValueSelector } from 'src/redux/selectors/accountSelector';
import { useQueryClient } from 'react-query';
import { Box, Button, Divider, Grid } from '@mui/material';
import { QueryKeys } from 'src/react-query/queryKeys';
import AmountWithTitleCard from 'src/components/Utils/AmountWithTitleCard';
import { MainButton } from 'src/components/Theme/StyledComponents';
import useCurrencyConversion from 'src/utils/useCurrencyConversion';
import { selectedCurrencySelector } from 'src/redux/selectors/currencySelector';
import routeNames from 'src/routes/routeNames';
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
  const navigate = useNavigate();

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
  }), [userRoleAsString]);

  const userRoleDescription = useMemo(() => userRoleDescriptions[userRoleAsString], [userRoleAsString]);

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

  const organizationTokens = useSelector(organizationTokensSelector);
  const [organizatonAssets, setOrganizationAssets] = useState({
    tokens: 0,
    NFTs: 0,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const nfts = queryClient.getQueryData(QueryKeys.ALL_ORGANIZATION_NFTS) as any;
    setOrganizationAssets(
      (assets) => ({ ...assets, tokens: organizationTokens?.length ?? 0, NFTs: nfts?.length ?? 0 }),
    );
  }, [organizationTokens, queryClient]);

  const totalUsdValue = useSelector(totalUsdValueSelector);
  const totalUsdValueConverted = useCurrencyConversion(totalUsdValue);
  const getCurrency = useSelector(selectedCurrencySelector);

  if (!parseMultisigAddress(multisigAddressParam ?? '')) {
    return <Navigate to="/multisig" />;
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', padding: '12px 0', gap: '12px' }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={3}>
            <AmountWithTitleCard
              needsDollarSign={false}
              amountValue={''}
              amountUnityMeasure={t(userRoleAsString)}
              title={'Your Role'}
              actionButton={(
                <Button
                  disabled
                  sx={{
                    background: '#eee !important',
                    border: '1px solid #ddd !important',
                    padding: '0.5rem',
                    marginTop: '1rem',
                    width: '100%',
                  }}
                >
                  <InfoOutlinedIcon sx={{ marginRight: '5px' }} />
                  {userRoleDescription}
                </Button>
)}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <AmountWithTitleCard
              needsDollarSign={false}
              amountValue={
            `${(Number(parseFloat(totalUsdValueConverted.toFixed(2))).toLocaleString())} ${getCurrency}`
          }
              amountUnityMeasure={''}
              actionButton={(
                <ReceiveModal showQrFromCard address={currentContract?.address} />
)}
              title={'Organization Funds'}
            />
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', padding: '12px 0', gap: '12px' }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={3}>
            <AmountWithTitleCard
              needsDollarSign={false}
              amountValue={organizatonAssets.tokens.toString()}
              amountUnityMeasure={'Tokens'}
              title={'Organization Tokens'}
              actionButton={(
                <MainButton
                  key="0"
                  variant="outlined"
                  size="medium"
                  sx={{
                    fontSize: '14px',
                    fontWeight: '400 !important',
                    paddingLeft: '4px !important',
                    width: '100%',
                    marginTop: '1rem',
                  }}
                  className="shadow-sm rounded mr-2"
                  onClick={() =>
                    navigate(routeNames.assets)
              }
                >
                  <AssetActionIcon width="25px" height="25px" /> View Coins
                </MainButton>
)}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <AmountWithTitleCard
              needsDollarSign={false}
              amountValue={
            organizatonAssets.NFTs.toString()
          }
              amountUnityMeasure={'NFTs'}
              actionButton={(
                <MainButton
                  key="0"
                  variant="outlined"
                  size="medium"
                  sx={{
                    fontSize: '14px',
                    fontWeight: '400 !important',
                    paddingLeft: '4px !important',
                    width: '100%',
                    marginTop: '1rem',
                  }}
                  className="shadow-sm rounded mr-2"
                  onClick={() =>
                    navigate(routeNames.nft)
              }
                >
                  <AssetActionIcon width="25px" height="25px" /> View NFTs
                </MainButton>
)}
              title={'Organization NFTs'}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <AmountWithTitleCard
              needsDollarSign={false}
              amountValue={contractInfo.totalBoardMembers.toString() ?? '0'}
              amountUnityMeasure={'Owners'}
              actionButton={(
                <MainButton
                  key="0"
                  variant="outlined"
                  sx={{
                    fontSize: '14px',
                    fontWeight: '400 !important',
                    paddingLeft: '4px !important',
                    width: '100%',
                    marginTop: '1rem',
                  }}
                  className="shadow-sm rounded mr-2"
                  onClick={() => navigate(routeNames.owners)}
                >
                  <AssetActionIcon width="25px" height="25px" /> View Owners
                </MainButton>
)}
              title={'Organization Owners'}
            />
          </Grid>
          <Grid item xs={6} md={4} lg={3}>
            <AmountWithTitleCard
              needsDollarSign={false}
              amountValue={`${contractInfo.quorumSize?.toString() ?? '0'}/${contractInfo.totalBoardMembers} `}
              amountUnityMeasure={'Owners'}
              actionButton={(
                <MainButton
                  key="0"
                  variant="outlined"
                  sx={{
                    fontSize: '14px',
                    fontWeight: '400 !important',
                    paddingLeft: '4px !important',
                    width: '100%',
                    marginTop: '1rem',
                  }}
                  className="shadow-sm rounded mr-2"
                  onClick={() => navigate(routeNames.cvorum)}
                >
                  <AssetActionIcon width="25px" height="25px" /> View Quorum
                </MainButton>
)}
              title={'Organization Quorum'}
            />
          </Grid>
        </Grid>
      </Box>

    </>
  );
}

export default MultisigDetailsPage;
