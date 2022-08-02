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
                  <TextDivider>
                    <Box sx={{ mt: 0.2, mb: 0.2, pl: 1, fontWeight: '600' }}>{item.collection}</Box>
                  </TextDivider>
                </CollectionName>
              )}
              <Grid xs={12} sm={6} md={4} lg={3} item key={item.name}>
                <CardBox>
                  <Box sx={{
                    m: '0',
                    width: '100%',
                    position: 'relative',
                    zIndex: '0',
                    '&:before': {
                      position: 'absolute',
                      content: '""',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      backgroundColor: 'rgba(76, 47, 252, 0.1)',
                    },
                  }}
                  >
                    <CardMedia
                      component="img"
                      height="auto"
                      image={`${item.media[0].url}?w=150&h=150&fit=crop&auto=format`}
                      alt="nft"
                    />
                  </Box>
                  <CardContent
                    className="nftHover"
                    sx={{
                      p: '.5rem .8rem 0.95rem !important',
                      transform: 'translateY(25px)',
                      transition: 'transform .2s linear',
                    }}
                  >
                    <Typography
                      className="nftHover"
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: '600',
                        fontSize: '18px',
                        m: '0 0 0 .2rem !important',
                        textAlign: 'center',
                        transition: 'font-size .2s linear',
                      }}
                    >
                      {item.name}
                    </Typography>
                    <MainButton
                      className="nftHover"
                      sx={{
                        width: '100%',
                        fontWeight: '500 !important',
                        boxShadow: 'none !important',
                        mt: '.35rem',
                        fontSize: '13px !important',
                      }}
                      onClick={() => {
                        handleOptionSelected(ProposalsTypes.send_nft, item);
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
