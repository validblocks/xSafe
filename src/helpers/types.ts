export interface RawTransactionType {
  signature: string;
  value: string;
  receiver: string;
  gasPrice: number;
  gasLimit: number;
  data: string;
  sender: string;
  nonce: number;
  chainID: string;
  version: number;
  options: number;
}
