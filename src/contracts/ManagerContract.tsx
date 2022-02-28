import { getAccount, getAddress } from '@elrondnetwork/dapp-core';
import { sendTransactions } from '@elrondnetwork/dapp-core';
import {
  Address,
  AddressValue,
  SmartContract,
  TypedValue,
  U8Value
} from '@elrondnetwork/erdjs';
import {
  Balance,
  CodeMetadata,
  DeployArguments,
  GasLimit
} from '@elrondnetwork/erdjs/out';
import { Code } from '@elrondnetwork/erdjs/out/smartcontracts/code';

import { smartContractCode } from 'helpers/constants';

export const deployContractGasLimit = 200_000_000;

export async function deployMultisigContract() {
  const address = await getAddress();
  const account = await getAccount(address);
  const multisigAddress = SmartContract.computeAddress(
    new Address(address),
    account.nonce as any
  );
  const boardMembers = [new AddressValue(new Address(address))];
  const quorum = 1;
  const deployTransaction = getDeployContractTransaction(quorum, boardMembers);

  const transactions = [deployTransaction];
  const { sessionId } = await sendTransactions({
    transactions
  });
  return { sessionId, multisigAddress: multisigAddress.bech32() };
}

function getDeployContractTransaction(
  quorum: number,
  boardMembers: AddressValue[]
) {
  const contract = new SmartContract({});
  const code = Code.fromBuffer(Buffer.from(smartContractCode, 'hex'));
  const codeMetadata = new CodeMetadata(false, true, true);
  const quorumTyped = new U8Value(quorum);
  const initArguments: TypedValue[] = [quorumTyped, ...boardMembers];
  const value = Balance.Zero();
  const deployArguments: DeployArguments = {
    code,
    codeMetadata,
    initArguments,
    value,
    gasLimit: new GasLimit(deployContractGasLimit)
  };
  return contract.deploy(deployArguments);
}
