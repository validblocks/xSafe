import { Address, BigUIntValue } from '@multiversx/sdk-core/out';
import BigNumber from 'bignumber.js';
import { jewelSwapLendingContractAddress } from 'src/config';
import { MultisigActionDetailed } from 'src/types/multisig/MultisigActionDetailed';
import { MultisigLendInJewelSwap } from 'src/types/multisig/proposals/MultisigLendInJewelSwap';

export const sampleLendAction = new MultisigActionDetailed(
  new MultisigLendInJewelSwap(
    new Address(jewelSwapLendingContractAddress),
    new BigUIntValue(
      new BigNumber(Number('1'))
        .shiftedBy(18)
        .decimalPlaces(0, BigNumber.ROUND_FLOOR),
    ),
    'lendEgld',
  ),
  1,
  [
    new Address(
      'erd1qqqqqqqqqqqqqpgqp699jngundfqw07d8jzkepucvpzush6k3wvqyc44rx',
    ),
  ],
);
