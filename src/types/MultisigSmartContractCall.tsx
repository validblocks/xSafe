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
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';
import { multisigContractFunctionNames } from './multisigFunctionNames';
import { delegationFunctionNames } from './staking/delegationFunctionNames';

export class MultisigSmartContractCall extends MultisigAction {
  address: Address;

  amount: BigUIntValue;

  functionName: string;

  args: BytesValue[];

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
        return i18next.t('Withdraw Delegation');
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
