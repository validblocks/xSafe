import {
  getAccount,
  getAddress,
} from '@multiversx/sdk-dapp/utils/account';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import {
  Address,
  AddressValue,
  SmartContract,
  TypedValue,
  U8Value,
  CodeMetadata,
  DeployArguments,
  TokenPayment,
} from '@multiversx/sdk-core';
import { Code } from '@multiversx/sdk-core/out/smartcontracts/code';

import { smartContractCode } from 'src/helpers/constants';

export const deployContractGasLimit = 400_000_000;

export async function deployMultisigContract() {
  function getDeployContractTransaction(
    quorum: number,
    boardMembers: AddressValue[],
  ) {
    // NetworkConfig.getDefault().ChainID = getChainID();
    const contract = new SmartContract({});
    const code = Code.fromBuffer(Buffer.from(smartContractCode, 'hex'));
    const codeMetadata = new CodeMetadata(false, true, true);
    const quorumTyped = new U8Value(quorum);
    const initArguments: TypedValue[] = [quorumTyped, ...boardMembers];
    const value = TokenPayment.egldFromAmount(0);
    const deployArguments: DeployArguments = {
      code,
      codeMetadata,
      initArguments,
      value,
      chainID: getChainID(),
      gasLimit: deployContractGasLimit,
    };
    return contract.deploy(deployArguments);
  }
  try {
    const address = await getAddress();
    const account = await getAccount(address);

    const multisigAddress = SmartContract.computeAddress(
      new Address(address),
    account?.nonce as any,
    );
    const boardMembers = [new AddressValue(new Address(address))];
    const quorum = 1;
    const deployTransaction = getDeployContractTransaction(quorum, boardMembers);

    const transactions = [deployTransaction];
    const { sessionId, error } = await sendTransactions({
      transactions,
    });

    return { sessionId, multisigAddress: multisigAddress.bech32(), error };
  } catch (err) {
    throw Error('Error deploying safe!');
  }
}
