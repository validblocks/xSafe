import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';

export class DelegationApiNetworkProvider extends ApiNetworkProvider {
  async getDelegations(address: string) {
    return this.doGetGeneric(
      `accounts/${address}/delegations?forceRefresh=true`,
    );
  }

  async getProviderInfo(address: string) {
    return this.doGetGeneric(`providers/${address}?forceRefresh=true`);
  }
}

export const DelegationApiProvider = new DelegationApiNetworkProvider('/');
