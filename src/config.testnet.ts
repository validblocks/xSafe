import { object, string, InferType } from 'yup';

export const dAppName = 'xSafe';
export const decimals = 2;
export const denomination = 18;
export const gasPrice = 100_000_000;
export const version = 1;
export const gasPriceModifier = '0.01';
export const gasPerDataByte = '1500';
export const gasLimit = 10_000_000;
export const minGasLimit = 50_000;
export const maxGasLimit = 1499999999;

export const walletConnectBridge = 'https://bridge.walletconnect.org';
export const walletConnectDeepLink =
  'https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet.dev&link=https://maiar.com/';

export const issueTokenContractAddress =
  'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u';

const networkSchema = object({
  id: string().defined().required(),
  egldLabel: string().defined().required(),
  name: string().defined().required(),
  walletAddress: string(),
  apiAddress: string().required(),
  gatewayAddress: string(),
  explorerAddress: string().required(),
  delegationApi: string().required(),
  maiarIdApi: string().required(),
  storageApi: string().required(),
}).required();

export type NetworkType = InferType<typeof networkSchema>;

export const network: NetworkType = {
  id: 'testnet',
  name: 'Testnet',
  egldLabel: 'xEGLD',
  walletAddress: 'https://testnet-wallet.elrond.com/dapp/init',
  apiAddress: 'https://testnet-api.elrond.com',
  gatewayAddress: 'https://testnet-gateway.elrond.com',
  explorerAddress: 'http://testnet-explorer.elrond.com',
  delegationApi: 'https://testnet-delegation-api.elrond.com',
  maiarIdApi: 'https://testnet-id.maiar.com/api/v1',
  storageApi: 'https://testnet-extras-api.elrond.com',
};

networkSchema.validate(network, { strict: true }).catch(({ errors }) => {
  console.error(`Config invalid format for ${network.id}`, errors);
});
