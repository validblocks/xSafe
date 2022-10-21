import { Box, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { ProposalsTypes } from 'src/types/Proposals';
import { useDispatch, useSelector } from 'react-redux';
import {
  setProposeMultiselectSelectedOption,
  setSelectedNftToSend,
} from 'src/redux/slices/modalsSlice';
import { NFTType } from 'src/types/nfts';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { useTheme } from 'styled-components';
import { navbarSearchSelector } from 'src/redux/selectors/searchSelector';
import { useTranslation } from 'react-i18next';
import { useContractNFTs } from 'src/utils/useContractNFTs';
import { Fragment } from 'react';
import { EmptyList, CollectionName, TextDivider, CardBox } from './nft-style';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import { NftCollectionTitle } from './NftCollectionTitle';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import * as Styled from './styled';

function NftComponent() {
  const theme: any = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const navbarSearchParam = useSelector(navbarSearchSelector);

  const {
    isFetchingNFTs,
    isLoadingNFTs,
    isErrorOnFetchNFTs,
    contractNfts,
  } = useContractNFTs({ withSearchFilter: true, searchParam: navbarSearchParam });

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
    return <ErrorOnFetchIndicator dataName="NFT" />;
  }

  if (isLoadingNFTs || isFetchingNFTs) {
    return <LoadingDataIndicator dataName="NFT" />;
  }

  if (contractNfts?.length === 0) {
    return (
      <Grid container>
        <Grid xs={3} item>
          <CardBox
            className="d-flex align-items-center justify-content-center"
            sx={{ height: '300px' }}
          >
            <CardContent>
              <EmptyList>{ t('No NFTs to show') as string}</EmptyList>
            </CardContent>
          </CardBox>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box>
      {(
        <Grid layout exit={{ opacity: 0 }} component={motion.div} container spacing={2}>
          {contractNfts?.map((item: NFTType, index: number) => (
            <Fragment key={item.identifier}>
              {((index > 0 &&
                item.collection !== contractNfts[index - 1].collection) ||
                index === 0) && (
                <CollectionName>
                  <TextDivider>
                    {<NftCollectionTitle value={item.collection} />}
                  </TextDivider>
                </CollectionName>
              )}
              <Grid
                xs={12}
                sm={6}
                md={4}
                lg={3}
                item
                component={motion.div}
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
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
                  <Styled.NftCardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="span"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {item.name}
                    </Typography>
                    <Styled.SendNFTButton
                      disabled={isInReadOnlyMode}
                      onClick={() => handleOptionSelected(ProposalsTypes.send_nft, item)}
                    >
                      Send NFT
                    </Styled.SendNFTButton>
                  </Styled.NftCardContent>
                </CardBox>
              </Grid>
            </Fragment>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default NftComponent;
