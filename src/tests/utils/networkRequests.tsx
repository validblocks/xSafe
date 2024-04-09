import * as rawData from './rawData';

export interface MockImplementationType {
  networkRequests?: { [key: string]: () => Promise<unknown> };
}

const mockImplementation = ({ networkRequests }: MockImplementationType) => {
  const requests = {
    accountBalance: () => Promise.resolve({ data: rawData.accountBalance }),
    transactions: () => Promise.resolve({ data: rawData.transactions }),
    networkConfig: () => Promise.resolve({ data: rawData.networkConfig }),
    ...networkRequests,
  };

  return (url: string) => {
    switch (true) {
      case url.includes('/address/'):
        return requests.accountBalance();
      case url.includes('/transactions'):
        return requests.transactions();
      case url.includes('/network/config'):
        return requests.networkConfig();
      default: return Promise.reject(new Error('Not implemented'));
    }
  };
};

export default mockImplementation;
