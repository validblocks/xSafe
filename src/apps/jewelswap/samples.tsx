import { Address, BigUIntValue } from '@multiversx/sdk-core/out';
import BigNumber from 'bignumber.js';
import { jewelSwapLendingContractAddress } from 'src/config';
import { MultisigActionDetailed } from 'src/types/MultisigActionDetailed';
import { MultisigLendInJewelSwap } from 'src/types/MultisigLendInJewelSwap';
import { MultisigSmartContractCall } from 'src/types/MultisigSmartContractCall';

export const sampleTransaction = {
  gasLimit: 70000000,
  data: 'data',
  chainID: 'D',
  gasPrice: 1000000000,
  nonce: 201,
  version: 1,
  options: 1,
  receiver: 'erd1qqqqqqqqqqqqqpgqp699jngundfqw07d8jzkepucvpzush6k3wvqyc44rx',
  sender: 'erd1x5vaatpqp27v32ku9xk8rdkxxlnvp2nrltngq22z8ll30l894jwqhdzng8',
  signature:
    'dd757ee194213b8ec6dae142076a7a9d8c517f7c42d120b79a47f309c5c280645bb878d6a32b85471373f348316dc2a0a9db9a5bb2edea1dd84980a8301bb807',
  status: 'success',
  timestamp: 1620808866,
  txHash: 'f958dcf2a5e15a57d18ef5dd043713df1940ed15936736b69e368805cfc67345',
  value: '10000000000000000000',
};

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