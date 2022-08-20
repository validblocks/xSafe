import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import { network } from 'src/config';

export class ElrondApiNetworkProvider extends ApiNetworkProvider {
  async getDetailsOfAllTokens() {
    return this.doGetGeneric('mex/tokens');
  }

  async getTokenDetails(tokenIdentifier: string) {
    if (!tokenIdentifier) return undefined;
    return this.doGetGeneric(`tokens/${tokenIdentifier}`);
  }

  async getAddressTokens(address: string) {
    if (!address) return undefined;
    return this.doGetGeneric(`accounts/${address}/tokens`);
  }

  async getTokenDetailsForIdentifiers(tokenIdentifiers: string[]) {
    if (!tokenIdentifiers || tokenIdentifiers.length === 0) return undefined;
    return this.doGetGeneric(
      `tokens?identifiers=${tokenIdentifiers.join(',')}`,
    );
  }
}

export const ElrondApiProvider = new ElrondApiNetworkProvider(
  network?.apiAddress ?? '',
);
