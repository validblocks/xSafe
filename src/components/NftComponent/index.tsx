import React, { useEffect, useState } from 'react';
import { Box, Grid, Button } from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { network } from 'config';
import { uniqueContractAddress } from 'multisigConfig';
import useFetch from 'utils/useFetch';
import { EmptyList, Img, CollectionName, TextDivider } from './nft';

const NftCompmonent = () => {
  const fetchList = useFetch(
    `${network.apiAddress}/accounts/${uniqueContractAddress}/nfts`
  );
  const nftList: any = fetchList.data;

  const nftListSorted = nftList.sort((a: any, b: any) =>
    a.collection.localeCompare(b.collection)
  );

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    height: '250px',
    borderRadius: '10px',
    color: '#08041D'
  }));
  return (
    <Box>
      {nftListSorted.length > 0 ? (
        <Grid container spacing={1}>
          {nftListSorted.map((item: any, index: number) => (
            <>
              {((index > 0 &&
                item.collection !== nftListSorted[index - 1].collection) ||
                index === 0) && (
                <CollectionName sx={{ mt: 3 }}>
                  <TextDivider textAlign='left'>
                    <Box sx={{ mt: 3, mb: 3 }}>{item.collection}</Box>
                  </TextDivider>
                </CollectionName>
              )}
              <Grid xs={12} sm={3} item key={index}>
                <Item>
                  <ImageListItem>
                    <Box>
                      <Img
                        src={`${item.media[0].url}?w=248&fit=crop&auto=format`}
                        srcSet={`${item.media[0].url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.name}
                        loading='lazy'
                      />
                    </Box>
                    <ImageListItemBar title={item.name} position='below' />
                  </ImageListItem>
                  <Button className='new-transfer-btn' sx={{ width: '100%' }}>
                    Send NFT
                  </Button>
                </Item>
              </Grid>
            </>
          ))}
        </Grid>
      ) : (
        <Grid container>
          <Grid xs={3} item className='nft-block-wrapper'>
            <Item className='d-flex align-items-center justify-content-center'>
              <EmptyList>You don&apos;t have any NFTs yet.</EmptyList>
            </Item>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default NftCompmonent;
