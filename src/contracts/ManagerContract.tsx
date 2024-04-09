import { getAccount, getAddress } from '@multiversx/sdk-dapp/utils/account';
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
  TokenTransfer,
} from '@multiversx/sdk-core';
import { Code } from '@multiversx/sdk-core/out/smartcontracts/code';
import { requireContractCode } from 'src/utils/requireContractCode';

export const deployContractGasLimit = 100_000_000;

async function getDeployContractTransaction(
  quorum: number,
  boardMembers: AddressValue[],
) {
  const smartContractCode = await requireContractCode();
  const address = await getAddress();
  const contract = new SmartContract();
  const code = Code.fromHex(smartContractCode);
  const codeMetadata = new CodeMetadata(true, true, true, true);
  const quorumTyped = new U8Value(quorum);
  const initArguments: TypedValue[] = [quorumTyped, ...boardMembers];
  const value = TokenTransfer.egldFromAmount(0);
  const deployArguments: DeployArguments = {
    code,
    codeMetadata,
    initArguments,
    value,
    chainID: getChainID(),
    gasLimit: deployContractGasLimit,
    deployer: new Address(address),
  };
  return contract.deploy(deployArguments);
}

export async function deployMultisigContract() {
  try {
    const address = await getAddress();

    if (!address) throw Error('Error getting address');

    const account = await getAccount(address);

    if (!account || !account.nonce) {
      throw Error('Error getting account');
    }

    const multisigAddress = SmartContract.computeAddress(
      new Address(address),
      account.nonce,
    );
    const boardMembers = [new AddressValue(new Address(address))];
    const quorum = 1;
    const deployTransaction = await getDeployContractTransaction(
      quorum,
      boardMembers,
    );

    const transactions = [deployTransaction];
    const { sessionId, error } = await sendTransactions({
      transactions,
    });

    return { sessionId, multisigAddress: multisigAddress.bech32(), error };
  } catch (err) {
    throw Error('Error deploying safe!');
  }
}
