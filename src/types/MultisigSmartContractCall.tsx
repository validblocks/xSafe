import { ReactElement } from 'react';
import { Address, BinaryCodec } from '@elrondnetwork/erdjs/out';
import {
  BigUIntType,
  BigUIntValue,
  BytesValue,
  U32Type,
  U32Value,
} from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import i18next from 'i18next';
import startCase from 'lodash/startCase';
import MultisigSmartContractCallPresentation from 'src/types/MultisigSmartContractCallPresentation';
import { Box, Grid } from '@mui/material';
import StakingProviderBasedOnAddress from 'src/components/Staking/StakingProviderBasedOnAddress';
import TokenPresentationWithPrice from 'src/components/Utils/TokenPresentationWithPrice';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';
import { multisigContractFunctionNames } from './multisigFunctionNames';
import { delegationFunctionNames } from './staking/delegationFunctionNames';

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
    super(MultisigActionType.SendTransferExecute);
    this.address = address;
    this.amount = amount;
    this.functionName = functionName;
    this.args = args;
    MultisigSmartContractCall.stakingProviders = [];
  }

  tooltip() {
    switch (this.functionName) {
      case multisigContractFunctionNames.issue:
        return this.getIssueTokenToolTip();
      default:
    }

    return '';
  }

  getData() {
    switch (this.functionName) {
      case multisigContractFunctionNames.issue:
      case multisigContractFunctionNames.ESDTTransfer:
      case multisigContractFunctionNames.ESDTNFTTransfer:
        return null;
      default:
    }
    return `${this.functionName}${this.args.map(
      (arg) => `@${arg.valueOf().toString('hex')}`,
    )}`;
  }

  title() {
    switch (this.functionName) {
      case multisigContractFunctionNames.issue:
        return i18next.t('Issue Token');
      case multisigContractFunctionNames.ESDTTransfer:
        return i18next.t('Send Token');
      case multisigContractFunctionNames.ESDTNFTTransfer:
        return i18next.t('Send NFT');
      case delegationFunctionNames.delegate:
        return i18next.t('Stake Tokens');
      case delegationFunctionNames.reDelegateRewards:
        return i18next.t('Restake Tokens');
      case delegationFunctionNames.unDelegate:
        return i18next.t('Unstake Tokens');
      case delegationFunctionNames.claimRewards:
        return i18next.t('Claim Rewards');
      case delegationFunctionNames.withdraw:
        return i18next.t('Withdraw Rewards');
      default:
        return 'Unknown function';
    }
  }

  description() {
    switch (this.functionName) {
      case multisigContractFunctionNames.issue:
        return this.getIssueTokenDescription();
      case multisigContractFunctionNames.ESDTTransfer:
        return this.getSendTokenDescription();
      case multisigContractFunctionNames.ESDTNFTTransfer:
        return this.getSendNFTDescription();
      case delegationFunctionNames.delegate:
        return this.getStakeTokensDescription('Stake to', <EastIcon />);
      case delegationFunctionNames.unDelegate:
        return this.getStakeTokensDescription('Unstake from', <WestIcon />);
      case delegationFunctionNames.withdraw:
        return this.getStakeTokensDescription('Withdraw rewards', <WestIcon />);
      case delegationFunctionNames.claimRewards:
        return this.getStakeTokensDescription('Claim rewards', <WestIcon />);
      case delegationFunctionNames.reDelegateRewards:
        return this.getStakeTokensDescription('Restake rewards', <WestIcon />);
      default:
        return 'Unknown function';
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
      <MultisigSmartContractCallPresentation identifier={identifier} amount={amount} address={this.address} />
    );
  }

  getStakeTokensDescription(actionMessage: string, actionIcon: any) {
    return (
      <Grid container display="flex" justifyContent="flex-start" gap={2}>
        <Grid
          item
          border={'1px solid #DFDFE8'}
          padding={'1rem'}
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          borderRadius={'10px'}
        >
          <Box
            marginRight={2}
            paddingRight={2}
            borderRight={'1px solid #DFDFE8'}
          >
            <TokenPresentationWithPrice withTokenAmount={false} withTokenValue={false} identifier="EGLD" />
          </Box>
          <Text display={'flex'} flexDirection={'column'}>
            <Text fontWeight={500} marginRight={1}> Amount: </Text>
            <Text>
              {/* {Balance.fromString(this.amount.valueOf().toString()).toDenominated()} $EGLD */}
              {this.amount.valueOf().toString()} $EGLD
            </Text>
          </Text>
        </Grid>
        <Grid item display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
          {actionMessage}
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
