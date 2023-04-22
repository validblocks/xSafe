/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Typography } from '@mui/material';
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
import * as Styled from './styled';
import PendingNftProposalAnnouncer from './PendingNftProposalAnnouncer';
import { Text } from '../StyledComponents/StyledComponents';

type Props = {
  nft: NFTType;
};

function NftCard({ nft }: Props) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const typographyRef = useRef<HTMLDivElement>(null);
  const isSFT = useMemo(() => 'balance' in nft, [nft]);
  const { isAlreadyProposed } = useIsAlreadyProposedMap();
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const [adjustedText, setAdjustedText] = useState<string>(nft.name);
  const sendButtonText = useMemo(() => (isSFT ? 'Send SFT' : 'Send NFT'), [isSFT]);

  const handleOptionSelected = useCallback((option: ProposalsTypes, nft: NFTType) => {
    dispatch(setProposeMultiselectSelectedOption({ option }));
    dispatch(
      setSelectedNftToSend(nft),
    );
  }, [dispatch]);

  const handleSendNftClick = useCallback((nft: NFTType) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    handleOptionSelected(
      isSFT
        ? ProposalsTypes.send_sft
        : ProposalsTypes.send_nft, nft);
    event.currentTarget.blur();
  }, [handleOptionSelected, isSFT]);

  useEffect(() => {
    if (typographyRef.current) {
      setAdjustedText(adjustTextByWidth({
        text: nft.name, containerWidth: typographyRef.current?.offsetWidth ?? 0, containerPadding2X: 25,
      }));
    }
  }, [nft.name, typographyRef]);

  return (
    <Styled.NftCardBox>
      {isAlreadyProposed[nft.identifier] && (
      <PendingNftProposalAnnouncer />
      )}
      <Styled.CardMediaContainer>
        <Styled.NftCardMedia
          component="img"
          height="auto"
          image={`${nft.media?.[0].thumbnailUrl}?w=150&h=150&fit=crop&auto=format`}
          alt="nft"
          loading="lazy"
        />
        {isSFT && (
        <Styled.SftBalanceAnnouncer>
          <Text textAlign="center" width="100%" fontWeight={700} fontSize={12}>{nft.balance as string}</Text>
        </Styled.SftBalanceAnnouncer>
        )}
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
            display: 'block',
          }}
        >
          {adjustedText}
        </Typography>
        <Styled.SendNFTButton
          disabled={isInReadOnlyMode || isAlreadyProposed[nft.identifier]}
          onClick={handleSendNftClick(nft)}
          sx={{
            width: '30px important',
          }}
        >
          {sendButtonText}
        </Styled.SendNFTButton>
      </Styled.NftCardContent>
    </Styled.NftCardBox>
  );
}

export default React.memo(NftCard);
