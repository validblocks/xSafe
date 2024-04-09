type Base64EncodedData = string;

export type TransactionLogEvent = {
  address: string;
  data: Base64EncodedData;
  identifier: string;
  order: number;
  topics: Base64EncodedData[];
};

export type TransactionLogs = {
  address: string;
  events: TransactionLogEvent[];
};

export type RawTransactionType = {
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
  timestamp: number;
  txHash: string;
  status: string;
  logs?: TransactionLogs;
};
