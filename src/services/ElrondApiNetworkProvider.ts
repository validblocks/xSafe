import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import { network } from 'src/config';
import { NFTType } from 'src/types/nfts';

export class ElrondApiNetworkProvider extends ApiNetworkProvider {
  async getDetailsOfAllTokens() {
    return this.doGetGeneric('mex/tokens');
  }

  async getTokenDetails(tokenIdentifier: string) {
    if (!tokenIdentifier) return undefined;
    return this.doGetGeneric(`tokens/${tokenIdentifier}`);
  }

  async getAddressTokens(address: string) {
    if (!address) {
      return undefined;
    }
    return this.doGetGeneric(`accounts/${address}/tokens`);
  }

  async getAccountDetails(contractAddress: string) {
    if (!contractAddress) {
      return undefined;
    }
    return this.doGetGeneric(`accounts/${contractAddress}`);
  }

  async getTokenDetailsForIdentifiers(tokenIdentifiers: string[]) {
    if (!tokenIdentifiers || tokenIdentifiers.length === 0) return undefined;
    return this.doGetGeneric(
      `tokens?identifiers=${tokenIdentifiers.join(',')}`,
    );
  }

  async getAddressTransactions(
    address: string,
    urlParams: URLSearchParams = new URLSearchParams(''),
  ) {
    if (!address) return undefined;
    return this.doGetGeneric(
      `accounts/${address}/transactions?${urlParams.toString()}`,
    );
  }

  async getAccountData(address: string) {
    if (!address) {
      return null;
    }
    return this.doGetGeneric(`accounts/${address}`);
  }

  async getEconomicsData() {
    return this.doGetGeneric('economics');
  }

  async validateMultisigAddress(address: string): Promise<boolean> {
    if (!address || address.length === 0) return false;

    try {
      return this.doGetGeneric(`accounts/${address}`);
    } catch (err) {
      console.error('error validating multisig address');
      return false;
    }
  }

  async fetchOrganizationNFTs(address: string): Promise<NFTType[]> {
    if (!address) return [];

    try {
      return this.doGetGeneric(`accounts/${address}/nfts`);
    } catch (err) {
      console.error('Error fetching NFTs');
      return [];
    }
  }

  async fetchOrganizationNFTCount(address: string): Promise<number> {
    if (!address) return 0;

    try {
      return this.doGetGeneric(`accounts/${address}/nfts/count`);
    } catch (err) {
      console.error('Error fetching NFTs');
      return 0;
    }
  }
}

export const ElrondApiProvider = new ElrondApiNetworkProvider(
  network?.apiAddress ?? '',
);
