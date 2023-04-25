import { ReactElement } from 'react';
import { Address, BinaryCodec } from '@multiversx/sdk-core/out';
import {
  BigUIntType,
  BigUIntValue,
  BytesValue,
  U32Type,
  U32Value,
} from '@multiversx/sdk-core/out/smartcontracts/typesystem';
import i18next from 'i18next';
import startCase from 'lodash/startCase';
import { Box, Grid } from '@mui/material';
import StakingProviderBasedOnAddress from 'src/components/Staking/StakingProviderBasedOnAddress';
import TokenPresentationWithPrice from 'src/components/Utils/TokenPresentationWithPrice';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import { StyledStakingProvider } from 'src/components/StyledComponents/staking';
import { ArgumentsParser } from 'src/utils/parsers/ArgumentsParser';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';
import { MultisigContractFunction } from './multisigFunctionNames';
import { delegationFunctionNames } from './staking/delegationFunctionNames';
import { DelegationFunctionTitles } from './types';
import ProposalAmount from './ProposalAmount';
import SendTokenProposalPresentation from './SendTokenProposalPresentation';
import { ExternalContractFunction } from './ExternalContractFunction';

export class MultisigSmartContractCall extends MultisigAction {
  address: Address;

  amount: BigUIntValue;

  functionName: string;

  args: BytesValue[];

  static stakingProviders: any[];

  constructor(
    address: Address,
    amount: BigUIntValue,
    functionName: string,
    args: BytesValue[] = [],
  ) {
    super(MultisigActionType.SendAsyncCall);
    this.address = address;
    this.amount = amount;
    this.functionName = functionName;
    this.args = args;
    MultisigSmartContractCall.stakingProviders = [];

    console.log({
      [this.functionName]: this.getData(),
      args: this.args.map((arg) => ({
        str: arg.valueOf().toString(),
        hex: arg.valueOf().toString('hex'),
      })),
    });

    if (this.functionName === 'setSpecialRole') {
      const parseSetRole = new ArgumentsParser().parseArguments(ExternalContractFunction.SET_SPECIAL_ROLE, args);
      console.log({ parseSetRole });
    }

    if (this.functionName === ExternalContractFunction.ESDT_NFT_CREATE) {
      const parsedResult = new ArgumentsParser().parseArguments(ExternalContractFunction.ESDT_NFT_CREATE, args);
      console.log({ parsedResult });
    }

    if (this.functionName === ExternalContractFunction.ISSUE_NON_FUNGIBLE) {
      const parsedIssue = new ArgumentsParser().parseArguments(ExternalContractFunction.ISSUE_NON_FUNGIBLE, args);
      console.log({ parsedIssue });
    }

    if (this.functionName === ExternalContractFunction.ISSUE_SEMI_FUNGIBLE) {
      const parsedSemiFungible = new ArgumentsParser().parseArguments(ExternalContractFunction.ISSUE_NON_FUNGIBLE, args);
      console.log({ parsedSemiFungible });
    }
  }

  tooltip() {
    switch (this.functionName) {
      case MultisigContractFunction.ISSUE:
        return this.getIssueTokenToolTip();
      default:
    }

    return '';
  }

  getData() {
    switch (this.functionName) {
      case MultisigContractFunction.ISSUE:
      case MultisigContractFunction.ESDT_TRANSFER:
      case MultisigContractFunction.ESDT_NFT_TRANSFER:
      default:
    }
    return `${this.functionName}${this.args.map(
      (arg) => `@${arg.valueOf().toString('hex')}`,
    )}`;
  }

  title() {
    switch (this.functionName) {
      case MultisigContractFunction.ISSUE:
        return i18next.t('Issue Token');
      case MultisigContractFunction.ESDT_TRANSFER:
        return i18next.t('Send token');
      case MultisigContractFunction.ESDT_NFT_TRANSFER:
        return i18next.t('Send NFT');
      case delegationFunctionNames.delegate:
        return i18next.t('Stake tokens');
      case delegationFunctionNames.reDelegateRewards:
        return i18next.t(DelegationFunctionTitles.RestakeRewards);
      case delegationFunctionNames.unDelegate:
        return i18next.t(DelegationFunctionTitles.UnstakeTokens);
      case delegationFunctionNames.claimRewards:
        return i18next.t(DelegationFunctionTitles.ClaimRewards);
      case delegationFunctionNames.withdraw: {
        return i18next.t(DelegationFunctionTitles.WithdrawRewards);
      }
      case ExternalContractFunction.ISSUE_NON_FUNGIBLE: {
        return i18next.t('Mint NFT Collection');
      }
      case ExternalContractFunction.ISSUE_SEMI_FUNGIBLE: {
        return i18next.t('Mint SFT Collection');
      }
      case ExternalContractFunction.AUCTION_TOKEN: {
        return i18next.t('Auction Token');
      }
      case ExternalContractFunction.ESDT_NFT_CREATE: {
        return i18next.t('Create NFT');
      }
      case ExternalContractFunction.SET_SPECIAL_ROLE: {
        return i18next.t('Set Special Role');
      }
      default:
        return 'Unknown function';
    }
  }

  description() {
    switch (this.functionName) {
      case MultisigContractFunction.ISSUE:
        return this.getIssueTokenDescription();
      case MultisigContractFunction.ESDT_TRANSFER:
        return this.getSendTokenDescription();
      case MultisigContractFunction.ESDT_NFT_TRANSFER:
        return this.getSendNFTDescription();
      case delegationFunctionNames.delegate:
        return this.getStakeTokensDescription(DelegationFunctionTitles.StakeTokens, <SouthIcon />);
      case delegationFunctionNames.unDelegate:
        return this.getStakeTokensDescription(DelegationFunctionTitles.UnstakeTokens, <NorthIcon />);
      case delegationFunctionNames.withdraw:
        return this.getStakeTokensDescription(DelegationFunctionTitles.WithdrawRewards, <NorthIcon />);
      case delegationFunctionNames.claimRewards:
        return this.getStakeTokensDescription(DelegationFunctionTitles.ClaimRewards, <NorthIcon />);
      case delegationFunctionNames.reDelegateRewards:
        return this.getStakeTokensDescription(DelegationFunctionTitles.RestakeRewards, <SouthIcon />);
      default:
        return this.title();
    }
  }

  getIssueTokenToolTip(): string {
    const extraProperties = [];
    let index = 4;
    while (index < this.args.length) {
      const name = this.args[index++].valueOf();
      const value = this.args[index++].valueOf();

      extraProperties.push({ name, value });
    }

    return extraProperties
      .map((x) => `${startCase(String(x.name))}: ${x.value}`)
      .join('\n');
  }

  getSendTokenDescription(): ReactElement {
    const identifier = this.args[0].valueOf().toString();
    const codec = new BinaryCodec();
    const amount = codec
      .decodeTopLevel<BigUIntValue>(this.args[1].valueOf(), new BigUIntType())
      .valueOf();

    return (
      <SendTokenProposalPresentation
        title="Send Token"
        identifier={identifier}
        amount={amount}
        address={this.address}
      />
    );
  }

  getStakeTokensDescription(actionMessage: DelegationFunctionTitles, actionIcon: any) {
    return (
      <Grid container display="flex" flexDirection={'column'} alignItems={'start'} justifyContent="flex-start" gap={2}>
        <StyledStakingProvider>
          <Box
            marginRight={2}
            paddingRight={2}
            borderRight={'1px solid #DFDFE8'}
          >
            <TokenPresentationWithPrice withTokenAmount={false} withTokenValue={false} identifier="EGLD" />
          </Box>
          <Box display={'flex'} flexDirection={'column'}>
            <Text fontWeight={500} marginRight={1}> Amount: </Text>
            <ProposalAmount
              delegationProposalType={actionMessage}
              multisigSmartContractCall={this}
            />
          </Box>
        </StyledStakingProvider>
        <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'}>
          {actionIcon}
          <Text mx={1}>{actionMessage}</Text>
          {actionIcon}
        </Grid>
        <Grid item>
          <StakingProviderBasedOnAddress providerAddress={this.address.bech32()} />
        </Grid>
      </Grid>
    );
  }

  getSendNFTDescription(): string {
    const identifier = this.args[0].valueOf().toString();

    return `${i18next.t('Identifier')}: ${identifier}`;
  }

  getIssueTokenDescription(): string {
    const name = this.args[0].valueOf().toString();
    const identifier = this.args[1].valueOf().toString();

    const codec = new BinaryCodec();
    const amount = codec
      .decodeTopLevel<BigUIntValue>(this.args[2].valueOf(), new BigUIntType())
      .valueOf();
    const decimals = codec
      .decodeTopLevel<U32Value>(this.args[3].valueOf(), new U32Type())
      .valueOf()
      .toNumber();

    const amountString = amount
      .toString()
      .slice(0, amount.toString().length - decimals);

    return `${i18next.t('Name')}: ${name}, ${i18next.t(
      'Identifier',
    )}: ${identifier}, ${i18next.t('Amount')}: ${amountString}, ${i18next.t(
      'Decimals',
    )}: ${decimals}`;
  }
}
