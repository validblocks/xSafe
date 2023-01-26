/* eslint-disable no-nested-ternary */
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
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
import { useQueryClient } from 'react-query';
import { QueryKeys } from 'src/react-query/queryKeys';
import { multisigContractFunctionNames } from 'src/types/multisigFunctionNames';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { TypedValue } from '@multiversx/sdk-core/out';
import { EmptyList, CollectionName, TextDivider, CardBox } from './nft-style';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import { NftCollectionTitle } from './NftCollectionTitle';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import * as Styled from './styled';
import PendingNftProposalAnnouncer from './PendingNftProposalAnnouncer';

function NftComponent() {
  const theme: any = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const navbarSearchParam = useSelector(navbarSearchSelector);
  const width600px = useMediaQuery('(max-width:600px)');
  const width472px = useMediaQuery('(max-width:472px)');
  const queryClient = useQueryClient();
  const cachedPendingActions = queryClient.getQueryData(QueryKeys.ALL_PENDING_ACTIONS) as MultisigActionDetailed[];
  const isAlreadyProposed = cachedPendingActions
    ?.filter((p: MultisigActionDetailed) => {
      if ('functionName' in p.action && 'args' in p.action) {
        return p.action.functionName === multisigContractFunctionNames.ESDTNFTTransfer;
      }
      return false;
    })
    ?.reduce((acc, p) => {
      if ('args' in p.action) {
        const proposalArgs = p.action.args as TypedValue[];
        const arg0 = proposalArgs[0].valueOf().toString();
        const arg1 = proposalArgs[1].valueOf().toString('hex');
        const collectionAndNonce = `${arg0}-${arg1}`;
        acc[collectionAndNonce] = true;
      }
      return acc;
    }, {} as Record<string, boolean>) ?? {};

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
      <Grid container margin={width600px ? '0px' : '-9px 0 0 -9px'}>
        <Grid xs={12} item>
          <CardBox
            className="d-flex align-items-center justify-content-center"
            sx={{ height: '300px', m: '0 !important' }}
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
        <Grid
          layout
          exit={{ opacity: 0 }}
          component={motion.div}
          container
          spacing={2}
          width={width600px ? '100%' : 'calc(100% + 16px)'}
          marginLeft={width600px ? '0px' : '-16px'}
          flex={width600px ? '0 1 auto' : ''}
          justifyContent={width472px ? 'center' : '' || width600px ? 'space-between' : ''}
          paddingBottom={width600px ? '44px' : 0}
        >
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
                sm={8}
                md={4}
                lg={3}
                item
                component={motion.div}
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                key={item.name}
                minWidth={width472px ? '100%' : '' || width600px ? '' : '270px'}
                maxWidth={width600px ? 'calc(50% - 10px) !important' : '270px !important'}
                padding={'0 !important'}
                justifyContent={width600px ? 'center' : ''}
                flexBasis={width600px ? 'calc(50% - 10px)' : ''}
                flexGrow={0}
                flexShrink={0}
              >

                <CardBox sx={{ position: 'relative' }}>
                  {isAlreadyProposed[item.identifier] && (
                  <PendingNftProposalAnnouncer />
                  )}
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
                      disabled={isInReadOnlyMode || isAlreadyProposed[item.identifier]}
                      onClick={(event) => {
                        handleOptionSelected(ProposalsTypes.send_nft, item);
                        event.currentTarget.blur();
                      }}
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
