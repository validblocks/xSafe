import { Box, Grid, useMediaQuery } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { MultiversXLogo } from 'src/components/Utils/MultiversXLogo';
import { PropertyKeyBox } from 'src/components/Utils/PropertKeyBox';
import { useNftAuctionClaimableAmount } from 'src/utils/useNftAuctionClaimableAmount';
import {
  Address,
  AddressValue,
  BigUIntValue,
  BytesValue,
  U64Value,
} from '@multiversx/sdk-core/out';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import { xSpotlightContractAddress } from 'src/config';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useSelector } from 'react-redux';
import { NFTMarketplace } from './types';
import { marketplaces } from './constants';
import * as Styled from './styled';

const ClaimNftAuction = () => {
  const claimableAmountResult = useNftAuctionClaimableAmount();
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const claimableAmount = useMemo(() => {
    if (!claimableAmountResult) return 0;

    const { denominatedClaimableAmount } = claimableAmountResult;
    return Number(denominatedClaimableAmount).toLocaleString();
  }, [claimableAmountResult]);

  const currentContract = useSelector(currentMultisigContractSelector);
  const handleClaimButtonClick = useCallback(() => {
    mutateSmartContractCall(
      new Address(xSpotlightContractAddress),
      new BigUIntValue(new BigNumber(0)),
      'claimTokens',
      new AddressValue(new Address(currentContract?.address ?? '')),
      BytesValue.fromUTF8('EGLD'),
      new U64Value(0),
    );
  }, [currentContract?.address]);

  return (
    <Box>
      <Box pb={2}>
        <Text fontSize={24} fontWeight={600}>
          Claim NFT Auction Tokens
        </Text>
      </Box>
      <Grid container spacing={2} alignContent="stretch">
        {marketplaces.map((marketplace: NFTMarketplace) => (
          <Grid key={marketplace.title} item>
            <Styled.NFTMarketplaceCard
              sx={{ maxWidth: maxWidth600 ? '100%' : '320px' }}
            >
              <Styled.NFTMarketplaceImgContainer>
                {marketplace.imgComponent}
                <Box pt={1}>
                  <Styled.ImageText textAlign="center" fontSize={12}>
                    The front-page of the MultiversX NFT ecosystem.
                  </Styled.ImageText>
                </Box>
              </Styled.NFTMarketplaceImgContainer>

              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="100%"
              >
                <Box>
                  <Box display="flex" py={1.5}>
                    <Box>
                      <Text fontSize="1.5rem" fontWeight={700}>
                        {marketplace.title}
                      </Text>
                    </Box>
                  </Box>
                  <Box pb={2}>
                    <Styled.NFTMarketplaceDescription>
                      {marketplace.description}
                    </Styled.NFTMarketplaceDescription>
                  </Box>
                </Box>
                <Box mt={1}>
                  <Box
                    display="flex"
                    sx={{
                      background: '#14131C',
                      borderRadius: '4px',
                      padding: ' 0.5rem',
                    }}
                  >
                    <PropertyKeyBox propertyKey={'Claimable'} />
                    <Box display="flex" alignItems="center">
                      <Text mr={1} fontWeight={700}>
                        {claimableAmount}
                      </Text>
                      <MultiversXLogo width={15} height={15} />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      paddingTop: '1rem',
                    }}
                  >
                    <MainButton
                      onClick={handleClaimButtonClick}
                      disabled={isInReadOnlyMode}
                      fullWidth
                    >
                      Propose Claim
                    </MainButton>
                  </Box>
                </Box>
              </Box>
            </Styled.NFTMarketplaceCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClaimNftAuction;
