import { Box } from '@mui/system';
import LendingInJewelSwapTitle from 'src/assets/img/LendingInJewelSwapTitle.svg';
import SearchIcon from '@mui/icons-material/Search';
import { BigUIntValue } from '@multiversx/sdk-core/out/smartcontracts/typesystem';
import { Grid } from '@mui/material';
import { StyledStakingProvider } from '../StyledComponents/staking';
import TokenPresentationWithPrice from '../Utils/TokenPresentationWithPrice';
import { Text } from '../StyledComponents/StyledComponents';
import SouthIcon from '@mui/icons-material/South';
import { jewelSwapLendingContractAddress, network } from 'src/config';
import RationalNumber from 'src/utils/RationalNumber';
import { useMemo } from 'react';
import { useCustomTheme } from 'src/utils/useCustomTheme';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import CopyButton from '../CopyButton';
import { AnchorPurple } from '../Layout/Navbar/navbar-style';
import * as Styled from '../../components/Utils/styled/index';

type Props = {
  parsedArgs: any;
  lendAmount: BigUIntValue;
};

const LendInJewelSwapPresentation = ({ parsedArgs: _, lendAmount }: Props) => {
  const amount = useMemo(
    () =>
      RationalNumber.fromBigInteger(
        lendAmount.valueOf().toString(),
      ).toLocaleString(),
    [lendAmount],
  );

  const theme = useCustomTheme();

  return (
    <Box>
      <img src={LendingInJewelSwapTitle} />
      <Box py={1}>
        <Text>
          With JewelSwap, you can Trade, Earn, Lend and Borrow with NFTs &
          $EGLD. JewelSwap aims to be the leading NFT x DeFi decentralized,
          permissionless protocol in MultiversX. Now with Leveraged Yield
          Farming!
        </Text>
      </Box>
      <Grid
        container
        display="flex"
        flexDirection={'column'}
        alignItems={'start'}
        justifyContent="flex-start"
        gap={2}
      >
        <Box pt={2}>
          <StyledStakingProvider>
            <Box
              marginRight={2}
              paddingRight={2}
              borderRight={'1px solid #DFDFE8'}
            >
              <TokenPresentationWithPrice
                withTokenAmount={false}
                withTokenValue={false}
                identifier="EGLD"
              />
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
              <Text fontWeight={500} marginRight={1}>
                {' '}
                Amount:{' '}
              </Text>
              {amount}
            </Box>
          </StyledStakingProvider>
        </Box>
        <Grid
          item
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <SouthIcon />
          <Text mx={1}>Lend</Text>
          <SouthIcon />
        </Grid>
        <Grid item>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            border={`1px solid ${theme.palette.borders.secondary}`}
            padding={'.5rem 1rem'}
            borderRadius={'10px'}
          >
            <Box display="flex">
              {truncateInTheMiddle(jewelSwapLendingContractAddress, 10)}
              <Box display="flex" gap={0.5} pl={0.75}>
                <CopyButton
                  className="ml-2"
                  link={Styled.CopyIconLinkPurple}
                  text={jewelSwapLendingContractAddress}
                />
                <AnchorPurple
                  href={`${network.explorerAddress}/accounts/${jewelSwapLendingContractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2"
                >
                  <SearchIcon />
                </AnchorPurple>
              </Box>
            </Box>
            <Box
              marginLeft={2}
              paddingLeft={2}
              borderLeft={'1px solid #DFDFE8'}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'start'}
            >
              <Text fontWeight={500} marginRight={1}>
                APY*:
              </Text>
              <Text>Up to 26%</Text>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LendInJewelSwapPresentation;
