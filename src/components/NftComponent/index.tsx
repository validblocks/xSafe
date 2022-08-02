import { Fragment } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { network } from 'src/config';
import { uniqueContractAddress } from 'src/multisigConfig';
import { ProposalsTypes } from 'src/types/Proposals';
import { useDispatch } from 'react-redux';
import {
  setProposeMultiselectSelectedOption,
  setSelectedNftToSend,
} from 'src/redux/slices/modalsSlice';
import { useQuery } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import axios from 'axios';
import { NFTType } from 'src/types/nfts';
import LoadingDataIndicator from 'src/components/Utils/LoadingDataIndicator';
import { EmptyList, CollectionName, TextDivider, CardBox } from './nft-style';

const fetchNfts = () => axios
  .get(`${network.apiAddress}/accounts/${uniqueContractAddress}/nfts`)
  .then((res) => res.data);

function NftCompmonent() {
  const {
    data: nftList,
    isFetching: isFetchingNFTs,
    isLoading: isLoadingNFTs,
    isError: isErrorOnFetchNFTs,
  } = useQuery(
    [
      QueryKeys.ALL_NFTS,
    ],
    () => fetchNfts(),
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true,
    },
  );
  const dispatch = useDispatch();

  const nftListSorted = nftList?.sort((a: NFTType, b: NFTType) => a.collection.localeCompare(b.collection));

  const handleOptionSelected = (option: ProposalsTypes, nft: any) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
    dispatch(
      setSelectedNftToSend({
        nonce: nft.nonce,
        identifier: nft.identifier,
      }),
    );
  };

  if (isErrorOnFetchNFTs) {
    return <div>Error while retrieving account NFTs</div>;
  }

  if (isLoadingNFTs || isFetchingNFTs) {
    return <LoadingDataIndicator dataName="nft" />;
  }

  if (nftListSorted?.length === 0) {
    return (
      <Grid container>
        <Grid xs={3} item>
          <CardBox
            className="d-flex align-items-center justify-content-center"
            sx={{ height: '300px' }}
          >
            <CardContent>
              <EmptyList>You don&apos;t have any NFTs yet.</EmptyList>
            </CardContent>
          </CardBox>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box>
      { (
        <Grid container spacing={2}>
          {nftListSorted?.map((item: NFTType, index: number) => (
            <Fragment key={item.identifier}>
              {((index > 0 &&
                item.collection !== nftListSorted[index - 1].collection) ||
                index === 0) && (
                <CollectionName>
                  <TextDivider textAlign="left">
                    <Box sx={{ mt: 3, mb: 3 }}>{item.collection}</Box>
                  </TextDivider>
                </CollectionName>
              )}
              <Grid xs={12} sm={6} md={4} lg={3} item key={item.name}>
                <CardBox>
                  <Box>
                    <CardMedia
                      component="img"
                      height="auto"
                      image={`${item.media[0].url}?w=164&h=164&fit=crop&auto=format`}
                      alt="nft"
                      sx={{ borderRadius: '.5rem' }}
                    />
                  </Box>
                  <CardContent sx={{ p: '.5rem .5rem 0.95rem .5rem !important' }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: '600', fontSize: '15px', pl: '.12rem !important' }}
                    >
                      {item.name}
                    </Typography>
                    <MainButton
                      sx={{ width: '100%', fontWeight: '500 !important', boxShadow: 'none !important' }}
                      onClick={(e) => {
                        handleOptionSelected(ProposalsTypes.send_nft, item);
                        console.log('obj', e.target);
                      }
                      }
                    >
                      Send NFT
                    </MainButton>
                  </CardContent>
                </CardBox>
              </Grid>
            </Fragment>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default NftCompmonent;
