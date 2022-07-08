import * as tokenServices from '@elrondnetwork/dapp-core-internal';
import * as multisigExtrasConfig from '../multisigExtrasConfig';
export let accessTokenServices: any = null;
export let storageApi = null;
export let maiarIdApi = null;

try {
  storageApi = multisigExtrasConfig?.storageApi as any;
  maiarIdApi = multisigExtrasConfig?.maiarIdApi as any;
  accessTokenServices = tokenServices as any;
} catch (err) {}
