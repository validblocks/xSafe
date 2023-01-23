import { Address } from '@multiversx/sdk-core/out';
import { Box } from '@mui/system';
import i18next from 'i18next';
import MemberPresentationWithPhoto from 'src/pages/Organization/MemberPresentationWithPhoto';
import { MultisigAction } from './MultisigAction';
import { MultisigActionType } from './MultisigActionType';

export class MultisigSendToken extends MultisigAction {
  address: Address;

  identifier: string;

  amount: number;

  constructor(address: Address, identifier: string, amount: number) {
    super(MultisigActionType.SendTransferExecute);
    this.address = address;
    this.identifier = identifier;
    this.amount = amount;
  }

  title() {
    return i18next.t('Send Token');
  }

  description() {
    return (
      <Box>
        From:
        <MemberPresentationWithPhoto memberAddress={this.address} />
      </Box>
    );
  }

  tooltip() {
    return '';
  }
}
