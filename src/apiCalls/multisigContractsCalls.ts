import {
  maiarIdApi,
  accessTokenServices,
  storageApi
} from 'src/services/accessTokenServices';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getAddress } from '@elrondnetwork/dapp-core';
import axios, { AxiosError } from 'axios';
import uniqBy from 'lodash/uniqBy';
import { verifiedContractsHashes } from 'src/helpers/constants';
import { network } from 'src/config';
import { MultisigContractInfoType } from 'src/types/multisigContracts';

const contractsInfoStorageEndpoint = `${storageApi}/settings/multisig`;

const multisigAxiosInstance = axios.create();

multisigAxiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (accessTokenServices?.services != null) {
        const address = await getAddress();
        const token =
          await accessTokenServices?.services?.maiarId?.getAccessToken({
            address,
            maiarIdApi
          });
        config.headers.Authorization = `Bearer ${token.accessToken}`;
      }
    } catch (err) {
      console.error(err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

multisigAxiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 403) {
      console.log('Axios request 403. Logging out.');
      // logout(routeNames.unlock);
    }
    return Promise.reject(error);
  }
);
export async function getUserMultisigContractsList() {
  try {
    const response = await multisigAxiosInstance.get(
      contractsInfoStorageEndpoint
    );
    const { data } = response;
    if (data != null) {
      return data;
    }
    return [];
  } catch (err) {
    console.error('error getting multisig contracts');
    return [];
  }
}
export async function validateMultisigAddress(
  address: string
): Promise<boolean> {
  try {
    const response = await axios.get(
      `${network.apiAddress}/accounts/${address}`
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
      `${network.apiAddress}/address/${address}`
    );
    const { data, code } = response.data;
    if (code === 'successful') {
      const {
        account: { codeHash }
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
  newContract: MultisigContractInfoType
): Promise<MultisigContractInfoType[]> {
  const currentContracts = await getUserMultisigContractsList();
  const newContracts = uniqBy(
    [...currentContracts, newContract],
    (contract) => contract.address
  );
  await multisigAxiosInstance.post(contractsInfoStorageEndpoint, newContracts);
  return newContracts;
}

export async function updateMultisigContractOnServer(
  newContract: MultisigContractInfoType
): Promise<MultisigContractInfoType[]> {
  const currentContracts = await getUserMultisigContractsList();
  const newContracts = currentContracts.map(
    (contract: MultisigContractInfoType) => {
      if (contract.address === newContract.address) {
        return { ...contract, ...newContract };
      }
      return contract;
    }
  );
  await multisigAxiosInstance.post(contractsInfoStorageEndpoint, newContracts);
  return newContracts;
}

export async function removeContractFromMultisigContractsList(
  deletedContractAddress: string
): Promise<MultisigContractInfoType[]> {
  const currentContracts = await getUserMultisigContractsList();
  const newContracts = currentContracts.filter(
    (contract: MultisigContractInfoType) =>
      contract.address !== deletedContractAddress
  );
  await multisigAxiosInstance.post(contractsInfoStorageEndpoint, newContracts);
  return newContracts;
}
