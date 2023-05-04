/* eslint-disable no-nested-ternary */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { navbarSearchSelector } from 'src/redux/selectors/searchSelector';
import { useContractNFTs } from 'src/utils/useContractNFTs';
import NoActionsOverlay from 'src/pages/Transactions/utils/NoActionsOverlay';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from 'styled-components';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import { NftCollectionTitle } from './NftCollectionTitle';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import NftGrid from './NftGrid';
import { Text } from '../StyledComponents/StyledComponents';

function NftComponent() {
  const navbarSearchParam = useSelector(navbarSearchSelector);
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const theme: any = useTheme();

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
            <Box key={collection} mb={2}>
              <Accordion
                sx={{
                  background: theme.palette.background.secondary,
                  color: '#fff',
                  borderRadius: '4px',
                  mb: 2,
                }}
              >
                <AccordionSummary
                  expandIcon={(
                    <ExpandMoreIcon
                      sx={{
                        color: theme.palette.text.menuItems,
                      }}
                    />
)}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid item xs={5} md={3}>
                      <NftCollectionTitle value={collection} />
                    </Grid>
                    <Grid
                      item
                      display="flex"
                      alignItems="center"
                      xs={collectionNfts.length > (window.innerWidth > 540 ? 2 : 1) ? 5 : 4}
                      md={2}
                    >
                      <Text
                        mr={1}
                        fontWeight={400}
                        fontSize={14}
                        sx={{
                          color: theme.palette.text.menuItems,
                        }}
                      >
                        Owns:
                      </Text>
                      <Text sx={{ whiteSpace: 'nowrap' }} fontWeight={900} fontSize={13}>
                        {collectionNfts.length} {collectionNfts.length === 1
                          ? collectionNfts.some((nft) => 'balance' in nft) ? 'SFT' : 'NFT'
                          : collectionNfts.some((nft) => 'balance' in nft) ? 'SFTs' : 'NFTs'}
                      </Text>
                    </Grid>
                    <Grid item display="flex">
                      {collectionNfts.slice(0, 5).map((nft) => (
                        <Box ml={1}>
                          <img
                            src={`${nft.media?.[0].thumbnailUrl}?w=30&h=30&fit=crop&auto=format`}
                            alt="nft"
                            width={40}
                            height={40}
                          />
                        </Box>
                      ))}
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    background: theme.palette.background.default,
                    p: 0,
                    pr: 2,
                    pb: 2,
                    border: `1px solid ${theme.palette.background.secondary}`,
                    borderTop: 'none',
                    borderBottomLeftRadius: '4px',
                    borderBottomRightRadius: '4px',
                  }}
                >
                  <NftGrid nfts={collectionNfts} />
                </AccordionDetails>
              </Accordion>
            </Box>
          ))}

        </Box>
      )}
    </Box>
  );
}

export default NftComponent;
