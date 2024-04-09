/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react';
import {
  Typography,
  AccordionDetails,
  Box,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { NFTType } from 'src/types/nfts';
import MemberPresentationWithPhoto from 'src/components/Utils/MemberPresentationWithPhoto';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Address } from '@multiversx/sdk-core/out';
import { SftBalanceAnnouncer } from './styled';

type Props = {
  nft: NFTType;
};

function NftPresentation({ nft }: Props) {
  const { address } = useGetAccountInfo();
  const isSFT = useMemo(() => 'balance' in nft, [nft]);
  const memoizedAddress = useMemo(() => new Address(address), [address]);
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ p: maxWidth600 ? '16px' : '16px 48px 0.9rem' }}>
      <Grid container className="mb-3 d-flex" spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {isSFT && (
            <SftBalanceAnnouncer sx={{ left: 20, bottom: 7 }}>
              <Text
                textAlign="center"
                width="100%"
                fontWeight={700}
                fontSize={12}
              >
                {nft.balance as string}
              </Text>
            </SftBalanceAnnouncer>
          )}
          <img
            src={nft.media?.[0].thumbnailUrl}
            alt="Nft Preview"
            className="rounded mr-2 w-100"
          />
        </Grid>
      </Grid>
      <Accordion
        sx={{
          background: '#D6CFFF1A',
          border: '1px solid #D6CFFF1A',
          color: '#fff',
          borderRadius: '4px',
          mb: 2,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#ddd' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>More Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid item xs={12}>
            <Box>
              <Box pb={2} display="flex" justifyContent="space-between">
                <Text fontWeight={600}>Token ID:</Text>
                <Text>{nft.name}</Text>
              </Box>
              <Box pb={2} display="flex" justifyContent="space-between">
                <Text fontWeight={600} mr={1}>
                  Royalties:
                </Text>
                <Text>{nft.royalties}%</Text>
              </Box>
              <Box pb={2} display="flex" justifyContent="space-between">
                <Text fontWeight={600} mr={1}>
                  Rank:
                </Text>
                <Text>#{nft.rank}</Text>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text fontWeight={600} mr={1}>
                  Token Type:
                </Text>
                <Text>{nft.type}</Text>
              </Box>
            </Box>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {nft.metadata?.attributes?.length > 0 && (
        <Accordion
          sx={{
            background: '#D6CFFF1A',
            border: '1px solid #D6CFFF1A',
            color: '#fff',
            borderRadius: '4px',
            mb: 2,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#ddd' }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              Attributes ({nft.metadata?.attributes?.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid item xs={12}>
              <Box>
                {nft.metadata?.attributes?.map(
                  (attribute: { value: string; trait_type: string }) => (
                    <Box
                      key={`${attribute.trait_type}-${attribute.value}`}
                      pb={2}
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Text fontWeight={600}>{attribute.trait_type}:</Text>
                      <Text overflow="hidden">{attribute.value}</Text>
                    </Box>
                  ),
                )}
              </Box>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      <Box
        sx={{
          p: '8px 16px',
          height: '100%',
          background: '#D6CFFF1A',
          border: '1px solid #D6CFFF1A',
          borderRadius: '4px',
        }}
      >
        <Typography sx={{ mb: '0.5rem', fontWeight: 500 }}>
          <Text>Sending from:</Text>
        </Typography>
        <MemberPresentationWithPhoto
          memberAddress={memoizedAddress}
          charactersLeftAfterTruncation={15}
        />
      </Box>
    </Box>
  );
}

export default React.memo(NftPresentation);
