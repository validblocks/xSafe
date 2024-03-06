import { Grid, useMediaQuery } from '@mui/material';
import NoActionsOverlay from 'src/components/Utils/NoActionsOverlay';
import { useContractNFTs } from 'src/hooks/useContractNFTs';
import { useSelector } from 'react-redux';
import { navbarSearchSelector } from 'src/redux/selectors/searchSelector';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import NftGrid from './NftGrid';

const NftsUngrouped = () => {
  const navbarSearchParam = useSelector(navbarSearchSelector);
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const { isFetchingNFTs, isLoadingNFTs, isErrorOnFetchNFTs, contractNfts } =
    useContractNFTs({
      withSearchFilter: true,
      searchParam: navbarSearchParam,
      leaveSftsLast: true,
      groupByCollection: false,
    });

  if (isErrorOnFetchNFTs) {
    return <ErrorOnFetchIndicator dataName="NFT" />;
  }

  if (isLoadingNFTs || isFetchingNFTs) {
    return <LoadingDataIndicator dataName="NFT" />;
  }

  if (!contractNfts || contractNfts?.length === 0) {
    return (
      <Grid container margin={maxWidth600 ? '0px' : '-9px 0 0 -9px'}>
        <Grid xs={12} item>
          <NoActionsOverlay message={'No NFTs to show'} />
        </Grid>
      </Grid>
    );
  }
  return <NftGrid nfts={contractNfts} />;
};

export default NftsUngrouped;
