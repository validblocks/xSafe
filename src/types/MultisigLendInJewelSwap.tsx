import { Address } from '@multiversx/sdk-core/out';
import {
  BigUIntValue,
  BytesValue,
} from '@multiversx/sdk-core/out/smartcontracts/typesystem';
import i18next from 'i18next';
import { Box, Grid } from '@mui/material';
import StakingProviderBasedOnAddress from 'src/components/Staking/StakingProviderBasedOnAddress';
import TokenPresentationWithPrice from 'src/components/Utils/TokenPresentationWithPrice';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { StyledStakingProvider } from 'src/components/StyledComponents/staking';
import { ArgumentsParser } from 'src/utils/parsers/ArgumentsParser';
import LendInJewelSwapPresentation from 'src/components/Proposals/LendInJewelSwapPresentation';
import { MultisigSmartContractCall } from './MultisigSmartContractCall';
import { ExternalContractFunction } from './ExternalContractFunction';
import ProposalAmount from './ProposalAmount';
import { DelegationFunctionTitles } from './types';

export class MultisigLendInJewelSwap extends MultisigSmartContractCall {
  constructor(
    address: Address,
    amount: BigUIntValue,
    functionName: string,
    args: BytesValue[] = [],
  ) {
    super(address, amount, functionName, args);
  }

  tooltip() {
    return 'Lend in JewelSwap';
  }

  getData() {
    return `${this.functionName}${this.args.map(
      (arg) => `@${arg.valueOf().toString('hex')}`,
    )}`;
  }

  title() {
    return i18next.t('Lend in JewelSwap');
  }

  description() {
    const parsedArgs = new ArgumentsParser().parseArguments(
      ExternalContractFunction.LEND_IN_JEWELSWAP,
      this.args,
    );
    return (
      <LendInJewelSwapPresentation
        lendAmount={this.amount}
        parsedArgs={parsedArgs}
      />
    );
  }

  getStakeTokensDescription(
    actionMessage: DelegationFunctionTitles,
    actionIcon: any,
  ) {
    return (
      <Grid
        container
        display="flex"
        flexDirection={'column'}
        alignItems={'start'}
        justifyContent="flex-start"
        gap={2}
      >
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
            <ProposalAmount
              delegationProposalType={actionMessage}
              multisigSmartContractCall={this}
            />
          </Box>
        </StyledStakingProvider>
        <Grid
          item
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          {actionIcon}
          <Text mx={1}>{actionMessage}</Text>
          {actionIcon}
        </Grid>
        <Grid item>
          <StakingProviderBasedOnAddress
            providerAddress={this.address.bech32()}
          />
        </Grid>
      </Grid>
    );
  }
}
