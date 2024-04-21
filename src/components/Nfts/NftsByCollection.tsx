/* eslint-disable no-nested-ternary */
import {
  Accordion,
  AccordionSummary,
  Grid,
  AccordionDetails,
} from '@mui/material';
import { Box } from '@mui/system';
import { useContractNFTs } from 'src/hooks/useContractNFTs';
import NoActionsOverlay from 'src/components/Utils/NoActionsOverlay';
import { useSelector } from 'react-redux';
import { navbarSearchSelector } from 'src/redux/selectors/searchSelector';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { NftCollectionTitle } from './NftCollectionTitle';
import NftGrid from './NftGrid';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import { Text } from '../StyledComponents/StyledComponents';

const NftsByCollection = () => {
  const theme = useCustomTheme();
  const navbarSearchParam = useSelector(navbarSearchSelector);

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
      <Grid container margin={0}>
        <Grid xs={12} item>
          <NoActionsOverlay message={'No NFTs to show'} />
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      {Object.entries(nftsGroupedByCollection).map(
        ([collection, collectionNfts]) => (
          <Box key={collection} marginBottom="10px">
            <Accordion
              sx={{
                color: '#fff',
                background: theme.palette.background?.secondary,
                '&&&': {
                  borderRadius: '10px',
                  border: 'none',
                  boxShadow: 'none',
                },
              }}
            >
              <AccordionSummary
                sx={{}}
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: theme.palette.text.menuItems,
                    }}
                  />
                }
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
                    xs={
                      collectionNfts.length > (window.innerWidth > 540 ? 2 : 1)
                        ? 5
                        : 4
                    }
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
                    <Text
                      sx={{ whiteSpace: 'nowrap' }}
                      fontWeight={900}
                      fontSize={13}
                    >
                      {collectionNfts.length}{' '}
                      {collectionNfts.length === 1
                        ? collectionNfts.some((nft) => 'balance' in nft)
                          ? 'SFT'
                          : 'NFT'
                        : collectionNfts.some((nft) => 'balance' in nft)
                        ? 'SFTs'
                        : 'NFTs'}
                    </Text>
                  </Grid>
                  <Grid item display="flex" alignItems="center">
                    {collectionNfts.slice(0, 5).map((nft) => (
                      <Box ml={1} key={nft.identifier}>
                        <img
                          src={`${nft.media?.[0].thumbnailUrl}?w=30&h=30&fit=crop&auto=format`}
                          alt="nft"
                          width={40}
                          height={40}
                        />
                      </Box>
                    ))}
                    {collectionNfts.length > 5 && (
                      <Box
                        sx={{
                          background: 'rgba(76, 47, 252, 0.1)',
                          padding: '0.25rem',
                          marginLeft: '0.5rem',
                          borderRadius: '4px',
                          color: '#4c2ffc',
                        }}
                      >
                        <AddRoundedIcon />
                      </Box>
                    )}
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
        ),
      )}
    </>
  );
};

export default NftsByCollection;
