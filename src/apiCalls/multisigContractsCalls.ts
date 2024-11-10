import axios from 'axios';
import uniqBy from 'lodash/uniqBy';
import { verifiedContractsHashes } from 'src/helpers/constants';
import { network } from 'src/config';
import { MultisigContractInfoType } from 'src/types/multisig/multisigContracts';
import { getAddress, getIsLoggedIn } from '@multiversx/sdk-dapp/utils';

export const contractsInfoStorageEndpoint = `${network.storageApi}/settings/multisig`;

export async function getUserMultisigContractsList() {
  try {
    const isLoggedIn = getIsLoggedIn();
    if (!isLoggedIn) return [];
    const walletAddress = await getAddress();

    const response = await axios.get(`/settings/${walletAddress}`, {
      baseURL: network.storageApi,
    });

    const { data } = response;
    if (data != null) {
      return data;
    }
    return [];
  } catch (err) {
    console.error('Error getting multisig contracts', {
      err,
    });
    return [];
  }
}

export async function validateMultisigAddress(
  address: string,
): Promise<boolean> {
  try {
    const response = await axios.get(
      `${network.apiAddress}/accounts/${address}`,
    );
    const { data } = response;
    if (data != null) {
      return verifiedContractsHashes.includes(data?.codeHash);
    }
  } catch (err) {
    console.error('error validating multisig address');
    return false;
  }
  return false;
}

export async function getIsContractTrusted(address?: string) {
  try {
    if (address == null) {
      return false;
    }
    const response = await axios.get(
      `${network.apiAddress}/address/${address}`,
    );
    const { data, code } = response.data;
    if (code === 'successful') {
      const {
        account: { codeHash },
      } = data;
      return codeHash != null && verifiedContractsHashes.includes(codeHash);
    }
    return false;
  } catch (err) {
    console.error('error validating contract');
    return false;
  }
}

export async function addContractToMultisigContractsList(
  newContract: MultisigContractInfoType,
): Promise<MultisigContractInfoType[]> {
  const currentContracts = await getUserMultisigContractsList();
  const newContracts = uniqBy(
    [...currentContracts, newContract],
    (contract) => contract.address,
  );

  const walletAddress = await getAddress();
  await axios.post(`/settings/${walletAddress}`, newContracts, {
    baseURL: network.storageApi,
  });

  return newContracts;
}

export async function updateMultisigContractOnServer(
  newContract: MultisigContractInfoType,
): Promise<MultisigContractInfoType[]> {
  const currentContracts = await getUserMultisigContractsList();
  const newContracts = currentContracts.map(
    (contract: MultisigContractInfoType) => {
      if (contract.address === newContract.address) {
        return { ...contract, ...newContract };
      }
      return contract;
    },
  );

  const walletAddress = await getAddress();
  await axios.post(`/settings/${walletAddress}`, newContracts, {
    baseURL: network.storageApi,
  });
  return newContracts;
}

export async function removeContractFromMultisigContractsList(
  deletedContractAddress: string,
): Promise<MultisigContractInfoType[]> {
  const currentContracts = await getUserMultisigContractsList();
  const newContracts = currentContracts.filter(
    (contract: MultisigContractInfoType) =>
      contract.address !== deletedContractAddress,
  );

  const walletAddress = await getAddress();
  await axios.post(`/settings/${walletAddress}`, newContracts, {
    baseURL: network.storageApi,
  });
  return newContracts;
}
