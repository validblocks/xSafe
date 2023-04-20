/* eslint-disable no-nested-ternary */
import React, { useCallback, useRef } from 'react';
import { Grid, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { ProposalsTypes } from 'src/types/Proposals';
import { useDispatch } from 'react-redux';
import {
  setProposeMultiselectSelectedOption,
  setSelectedNftToSend,
} from 'src/redux/slices/modalsSlice';
import { NFTType } from 'src/types/nfts';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { useTheme } from 'styled-components';
import { adjustTextByWidth } from 'src/utils/stringUtils';
import { useIsAlreadyProposedMap } from 'src/utils/useIsAlreadyProposedMap';
import { CardBox } from './nft-style';
import * as Styled from './styled';
import PendingNftProposalAnnouncer from './PendingNftProposalAnnouncer';

type Props = {
  nfts: NFTType[];
};

function NftGrid({ nfts }: Props) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const { isAlreadyProposed } = useIsAlreadyProposedMap();

  const handleOptionSelected = useCallback((option: ProposalsTypes, nft: NFTType) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
    dispatch(
      setSelectedNftToSend(nft),
    );
  }, [dispatch]);

  const handleSendNftClick = useCallback((nft: NFTType) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    handleOptionSelected(
      'balance' in nft
        ? ProposalsTypes.send_sft
        : ProposalsTypes.send_nft, nft);
    event.currentTarget.blur();
  }, [handleOptionSelected]);

  const typographyRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {nfts.map((nft: NFTType) => (
        <Grid
          xs={6}
          sm={6}
          md={4}
          lg={3}
          item
          key={nft.name}
          sx={{ padding: '0 16px 16px 0' }}
        >
          <CardBox sx={{ position: 'relative' }}>
            {isAlreadyProposed[nft.identifier] && (
            <PendingNftProposalAnnouncer />
            )}
            <Styled.CardMediaContainer>
              <CardMedia
                component="img"
                height="auto"
                image={`${nft.media?.[0].url}?w=150&h=150&fit=crop&auto=format`}
                alt="nft"
              />
            </Styled.CardMediaContainer>
            <Styled.NftCardContent>
              <Typography
                gutterBottom
                ref={typographyRef}
                variant="h6"
                component="span"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: '16px !important',
                  fontFamily: 'IBM Plex Sans',
                  whiteSpace: 'nowrap',
                }}
              >
                {adjustTextByWidth({
                  text: nft.name, containerWidth: typographyRef.current?.offsetWidth ?? 0, containerPadding2X: 20,
                })}
              </Typography>
              <Styled.SendNFTButton
                disabled={isInReadOnlyMode || isAlreadyProposed[nft.identifier]}
                onClick={handleSendNftClick(nft)}
                sx={{
                  width: '30px important',
                }}
              >
                {'balance' in nft ? 'Send SFT' : 'Send NFT'}
              </Styled.SendNFTButton>
            </Styled.NftCardContent>
          </CardBox>
        </Grid>
      ))}
    </>
  );
}

export default React.memo(NftGrid);
