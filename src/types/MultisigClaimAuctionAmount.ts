import { Address } from '@multiversx/sdk-core/out';
import i18next from 'i18next';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigClaimAuctionAmount extends MultisigAction {
  destinationAddress: Address;

  identifier: string;

  nonce: string;

  constructor(destinationAddress: Address, identifier: string, nonce: string) {
    super(MultisigActionType.SendTransferExecute);
    this.destinationAddress = destinationAddress;
    this.identifier = identifier;
    this.nonce = nonce;
  }

  title() {
    return i18next.t('Claim Auction Earnings');
  }

  description() {
    return `${this.identifier} (${this.description})`;
  }

  tooltip() {
    return '';
  }
}
