import { getAccount, getAddress } from '@multiversx/sdk-dapp/utils/account';
import { getChainID } from '@multiversx/sdk-dapp/utils/network';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import {
  Address,
  AddressValue,
  SmartContract,
  TypedValue,
  U8Value,
  TransactionsFactoryConfig,
  SmartContractTransactionsFactory,
  Account,
} from '@multiversx/sdk-core';
import { Code } from '@multiversx/sdk-core/out/smartcontracts/code';
import { requireContractCode } from 'src/utils/requireContractCode';
import { SendTransactionReturnType } from '@multiversx/sdk-dapp/types';

export const deployContractGasLimit = 100_000_000;

async function getDeployContractTransaction(
  quorum: number,
  boardMembers: AddressValue[],
) {
  const addressBech32 = await getAddress();
  const deployerAddress = new Address(addressBech32);

  const smartContractCode = await requireContractCode();
  const code = Code.fromHex(smartContractCode);

  const quorumTyped = new U8Value(quorum);
  const initArguments: TypedValue[] = [quorumTyped, ...boardMembers];

  const factoryConfig = new TransactionsFactoryConfig({
    chainID: getChainID(),
  });

  const factory = new SmartContractTransactionsFactory({
    config: factoryConfig,
  });

  const deployTransaction = factory.createTransactionForDeploy({
    sender: deployerAddress,
    bytecode: code.valueOf(),
    gasLimit: BigInt(deployContractGasLimit),
    arguments: initArguments,
    isUpgradeable: true,
    isPayable: true,
    isPayableBySmartContract: true,
    isReadable: true,
  });

  const deployerAccount = new Account(deployerAddress);

  deployTransaction.nonce = BigInt(+deployerAccount.getNonceThenIncrement());

  return deployTransaction;
}

export async function getAddressNonceOrThrow(address: string) {
  try {
    const account = await getAccount(address);
    const accountHasNonce =
      account &&
      'nonce' in account &&
      account.nonce !== null &&
      account.nonce !== undefined;

    if (!accountHasNonce) {
      throw Error(
        'Error getting account nonce. Nonce is not present, undefined or null!',
      );
    }

    return account.nonce;
  } catch (err) {
    console.error(err);
    throw Error('Error getting a account in getAddressNonceOrThrow!');
  }
}

export async function deployMultisigContract() {
  try {
    const address = await getAddress();

    if (!address) throw Error('Error getting address');

    const accountNonce = await getAddressNonceOrThrow(address);

    const multisigAddress = SmartContract.computeAddress(
      new Address(address),
      accountNonce,
    );
    const boardMembers = [new AddressValue(new Address(address))];
    const quorum = 1;
    const deployTransaction = await getDeployContractTransaction(
      quorum,
      boardMembers,
    );

    const transactions = [deployTransaction];
    const returnType: SendTransactionReturnType = await sendTransactions({
      transactions,
    });

    const { sessionId, error } = returnType;

    return { sessionId, multisigAddress: multisigAddress.bech32(), error };
  } catch (err) {
    console.error(err);
    throw Error('Error deploying safe!');
  }
}
