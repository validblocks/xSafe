import { Fragment, useCallback } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { ProposalsTypes } from 'src/types/Proposals';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProposeMultiselectSelectedOption,
  setSelectedNftToSend,
} from 'src/redux/slices/modalsSlice';
import { useQuery } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { USE_QUERY_DEFAULT_CONFIG } from 'src/react-query/config';
import { NFTType } from 'src/types/nfts';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { StateType } from 'src/redux/slices/accountSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import { EmptyList, CollectionName, TextDivider, CardBox } from './nft-style';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';

function NftCompmonent() {
  const dispatch = useDispatch();
  const currentContract = useSelector<StateType, MultisigContractInfoType>(currentMultisigContractSelector);

  const fetchNFTs = useCallback(
    () => ElrondApiProvider.fetchOrganizationNFTs(currentContract?.address),
    [currentContract],
  );

  const {
    data: nftList,
    isFetching: isFetchingNFTs,
    isLoading: isLoadingNFTs,
    isError: isErrorOnFetchNFTs,
  } = useQuery(
    [
      QueryKeys.ALL_ORGANIZATION_NFTS,
    ],
    () => fetchNFTs(),
    {
      ...USE_QUERY_DEFAULT_CONFIG,
      keepPreviousData: true,
    },
  );

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

  const rewriteNftsCollection = (value: string) => {
    const categoryNameOfNftsLETTERS = value.slice(0, value.indexOf('-'));
    const categoryNameOfNftsDIGITS = `(${value.slice(value.indexOf('-') + 1, value.length)})`;
    return (
      <Box sx={{ mt: 0.2, mb: 0.2, pl: 1 }}>
        <span className="font-weight-bold">{categoryNameOfNftsLETTERS}</span> <span className="collectionLight">{categoryNameOfNftsDIGITS}</span>
      </Box>
    );
  };

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
                    {rewriteNftsCollection(item.collection)}
                  </TextDivider>
                </CollectionName>
              )}
              <Grid
                xs={12}
                sm={6}
                md={4}
                lg={3}
                item
                key={item.name}
                sx={{
                  minWidth: '260px',
                  maxWidth: '270px !important',
                  p: '0 !important',
                }}
              >
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
                    sx={{
                      p: '.5rem .8rem 0.95rem !important',
                      position: 'relative',
                      overflow: 'hidden',
                      height: '93px',
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="span"
                    >
                      {item.name}
                    </Typography>
                    <MainButton
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
