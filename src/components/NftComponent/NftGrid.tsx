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
    <>
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
    </>
  );
}

export default React.memo(NftGrid);
