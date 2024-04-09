/* eslint-disable no-nested-ternary */
import React from 'react';
import { Grid } from '@mui/material';
import { NFTType } from 'src/types/nfts';
import NftCard from './NftCard';

type Props = {
  nfts: NFTType[];
};

function NftGrid({ nfts }: Props) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        margin: 0,
        width: '100% !important',
      }}
    >
      {nfts.map((nft: NFTType) => (
        <Grid
          xs={6}
          md={4}
          lg={3}
          xl={2}
          item
          key={nft.name}
        >
          <NftCard nft={nft} />
        </Grid>
      ))}
    </Grid>
  );
}

export default React.memo(NftGrid);
