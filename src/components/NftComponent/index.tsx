import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { MainButton } from 'components/Theme/StyledComponents';
import { network } from 'config';
import { uniqueContractAddress } from 'multisigConfig';
import useFetch from 'utils/useFetch';
import { ProposalsTypes } from 'types/Proposals';
import { useDispatch } from 'react-redux';
import {
  setProposeModalSelectedOption,
  setProposeMultiselectSelectedOption,
  setSelectedNftToSend
} from 'redux/slices/modalsSlice';
import { EmptyList, CollectionName, TextDivider, CardBox } from './nft-style';

const NftCompmonent = () => {
  const fetchNftList = useFetch(
    `${network.apiAddress}/accounts/${uniqueContractAddress}/nfts`
  );
  const dispatch = useDispatch();

  const nftList: any = fetchNftList.data;

  const nftListSorted = nftList.sort((a: any, b: any) =>
    a.collection.localeCompare(b.collection)
  );

  const handleOptionSelected = (option: ProposalsTypes, nft: any) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
    console.log(nft, 'nft');
    dispatch(
      setSelectedNftToSend({
        nonce: nft.nonce,
        identifier: nft.identifier
      })
    );
  };

  return (
    <Box>
      {nftListSorted.length > 0 ? (
        <Grid container spacing={2}>
          {nftListSorted.map((item: any, index: number) => (
            <>
              {((index > 0 &&
                item.collection !== nftListSorted[index - 1].collection) ||
                index === 0) && (
                <CollectionName>
                  <TextDivider textAlign='left'>
                    <Box sx={{ mt: 3, mb: 3 }}>{item.collection}</Box>
                  </TextDivider>
                </CollectionName>
              )}
              <Grid xs={12} sm={6} md={4} lg={3} item key={index}>
                <CardBox>
                  <Box>
                    <CardMedia
                      component='img'
                      height='auto'
                      image={`${item.media[0].url}?w=164&h=164&fit=crop&auto=format`}
                      alt='nft'
                    />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      {item.name}
                    </Typography>
                    <MainButton
                      sx={{ width: '100%' }}
                      onClick={() =>
                        handleOptionSelected(ProposalsTypes.send_nft, item)
                      }
                    >
                      Send NFT
                    </MainButton>
                  </CardContent>
                </CardBox>
              </Grid>
            </>
          ))}
        </Grid>
      ) : (
        <Grid container>
          <Grid xs={3} item>
            <CardBox
              className='d-flex align-items-center justify-content-center'
              sx={{ height: '300px' }}
            >
              <CardContent>
                <EmptyList>You don&apos;t have any NFTs yet.</EmptyList>
              </CardContent>
            </CardBox>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default NftCompmonent;
