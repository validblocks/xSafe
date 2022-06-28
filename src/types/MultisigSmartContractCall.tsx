import React, { ReactElement } from 'react';
import { operations, Ui } from '@elrondnetwork/dapp-utils';
import { Address, BinaryCodec } from '@elrondnetwork/erdjs/out';
import {
  BigUIntType,
  BigUIntValue,
  BytesValue,
  U32Type,
  U32Value
} from '@elrondnetwork/erdjs/out/smartcontracts/typesystem';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import i18next from 'i18next';
import startCase from 'lodash/startCase';
import ExplorerLink from 'components/ExplorerLink';
import { denomination } from 'config';
import MemberPresentationWithPhoto from 'pages/Organization/MemberPresentationWithPhoto';
import { MultisigAction } from './MultisigAction';

import { MultisigActionType } from './MultisigActionType';
import { multisigContractFunctionNames } from './multisigFunctionNames';

const StyledTypography = withStyles({
  root: {
    color: 'rgb(93, 109, 116)',
    letterSpacing: 0.5
  }
})(Typography);

export class MultisigSmartContractCall extends MultisigAction {
  address: Address;

  amount: BigUIntValue;

  functionName: string;

  args: BytesValue[];

  constructor(
    address: Address,
    amount: BigUIntValue,
    functionName: string,
    args: BytesValue[] = []
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
    }

    return '';
  }

  getData() {
    switch (this.functionName) {
      case multisigContractFunctionNames.issue:
      case multisigContractFunctionNames.ESDTTransfer:
        return null;
    }
    return `${this.functionName}${this.args.map(
      (arg) => `@${arg.valueOf().toString('hex')}`
    )}`;
  }

  title() {
    switch (this.functionName) {
      case multisigContractFunctionNames.issue:
        return i18next.t('Issue Token');
      case multisigContractFunctionNames.ESDTTransfer:
        return i18next.t('Send Token');
    }
    return i18next.t('Smart contract call');
  }

  description() {
    switch (this.functionName) {
      case multisigContractFunctionNames.issue:
        return this.getIssueTokenDescription();
      case multisigContractFunctionNames.ESDTTransfer:
        return this.getSendTokenDescription();
    }
    return (
      <div className='d-flex flex-wrap transaction'>
        <span className='mr-1 text-body'>
          <Ui.Denominate
            value={this.amount.valueOf().toString()}
            showLastNonZeroDecimal
            showLabel
          />
        </span>
        <span className='mr-1'>{i18next.t('to')}</span>
        <div className='address'>
          <Ui.Trim text={this.address.bech32()} />
          <ExplorerLink
            page={`accounts/${this.address.bech32()}`}
            text={<FontAwesomeIcon icon={faExternalLinkAlt} size='sm' />}
            className='link-second-style'
          />
        </div>
      </div>
    );
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
      <Box>
        <h4>
          <strong>Send Token</strong>
        </h4>
        <Box>
          <StyledTypography variant='subtitle1' sx={{ marginRight: '0.75rem' }}>
            <strong className='mr-3'>{i18next.t('Identifier')}:</strong>
            {identifier}{' '}
          </StyledTypography>
        </Box>
        <Box>
          <StyledTypography
            sx={{
              color: 'rgb(93, 109, 116)',
              letterSpacing: 0.5,
              marginRight: '0.75rem'
            }}
            variant='subtitle1'
          >
            <strong className='mr-3'>{i18next.t('Amount')}:</strong>
            {operations.denominate({
              input: amount.toString(),
              denomination,
              decimals: 4,
              showLastNonZeroDecimal: true
            })}{' '}
          </StyledTypography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <StyledTypography variant='subtitle1' sx={{ marginRight: '0.75rem' }}>
            <strong>To: </strong>
          </StyledTypography>
          <MemberPresentationWithPhoto
            memberAddress={this.address}
            charactersLeftAfterTruncation={20}
          />
        </Box>
      </Box>
    );
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
      'Identifier'
    )}: ${identifier}, ${i18next.t('Amount')}: ${amountString}, ${i18next.t(
      'Decimals'
    )}: ${decimals}`;
  }
}
