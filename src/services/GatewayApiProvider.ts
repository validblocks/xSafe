import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';

export class ElrondGatewayApiNetworkProvider extends ApiNetworkProvider {
  async getUserContractsFromStorage(address: string): Promise<any> {
    if (!address) return [];

    try {
      return this.doGetGeneric(`address/${address}/keys`);
    } catch (err) {
      console.error('Error fetching contracts from storage.');
      return [];
    }
  }

  async addContractToAddressStorage(
    address: string,
    newContracts: any,
  ): Promise<any> {
    if (!address) return [];

    try {
      return this.doPostGeneric(`address/${address}/keys`, newContracts);
    } catch (err) {
      console.error('Error fetching contracts from storage.');
      return [];
    }
  }
}

export const ElrondGatewayApiProvider = new ElrondGatewayApiNetworkProvider(
  ' ',
);
