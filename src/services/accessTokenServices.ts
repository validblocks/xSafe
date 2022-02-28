export let accessTokenServices: any = null;
export let storageApi = null;
export let maiarIdApi = null;

try {
  const multisigExtrasConfig = require('multisigExtrasConfig');
  storageApi = multisigExtrasConfig?.storageApi;
  maiarIdApi = multisigExtrasConfig?.maiarIdApi;
  accessTokenServices = require('@elrondnetwork/dapp-core-internal');
} catch (err) {}
