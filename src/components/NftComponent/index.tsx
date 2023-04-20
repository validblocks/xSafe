/* eslint-disable no-nested-ternary */
import { Box, Grid, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { navbarSearchSelector } from 'src/redux/selectors/searchSelector';
import { useContractNFTs } from 'src/utils/useContractNFTs';
import NoActionsOverlay from 'src/pages/Transactions/utils/NoActionsOverlay';
import { CollectionName, TextDivider } from './nft-style';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import { NftCollectionTitle } from './NftCollectionTitle';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import NftGrid from './NftGrid';

function NftComponent() {
  const navbarSearchParam = useSelector(navbarSearchSelector);
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const {
    isFetchingNFTs,
    isLoadingNFTs,
    isErrorOnFetchNFTs,
    nftsGroupedByCollection,
  } = useContractNFTs({
    withSearchFilter: true,
    searchParam: navbarSearchParam,
    leaveSftsLast: true,
    groupByCollection: true,
  });

  console.log({ nftsGroupedByCollection });

  if (isErrorOnFetchNFTs) {
    return <ErrorOnFetchIndicator dataName="NFT" />;
  }

  if (isLoadingNFTs || isFetchingNFTs) {
    return <LoadingDataIndicator dataName="NFT" />;
  }

  if (Object.keys(nftsGroupedByCollection)?.length === 0) {
    return (
      <Grid container margin={maxWidth600 ? '0px' : '-9px 0 0 -9px'}>
        <Grid xs={12} item>
          <NoActionsOverlay message={'No NFTs to show'} />
        </Grid>
      </Grid>
    );
  }

  return (
    <Box padding="0" paddingBottom={maxWidth600 ? '44px' : 0}>
      {(
        <Box
          component={motion.div}
          exit={{ opacity: 0 }}
        >
          {Object.entries(nftsGroupedByCollection).map(([collection, collectionNfts]) => (
            <Box key={collection}>
              <CollectionName>
                <TextDivider>
                  <NftCollectionTitle value={collection} />
                </TextDivider>
              </CollectionName>
              <Grid
                container
                sx={{
                  margin: 0,
                }}
              >
                <NftGrid nfts={collectionNfts} />
              </Grid>
            </Box>
          ))}

        </Box>
      )}
    </Box>
  );
}

export default NftComponent;
