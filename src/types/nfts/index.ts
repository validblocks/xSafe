export interface NFTMedia {
  fileSize: number;
  fileType: string;
  originalUrl: string;
  thumbnailUrl: string;
  url: string;
}

export interface NFTMetadataAttribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadataImage {
  fileName: string;
  hash: string;
  href: string;
  ipfsCid: string;
  ipfsUri: string;
}

export interface NFTMetadata {
  attributes: NFTMetadataAttribute[];
  description: string;
  edition: number;
  image: NFTMetadataImage;
  name: string;
  tags: string;
}

export interface NFTType {
  attributes: string;
  collection: string;
  creator: string;
  identifier: string;
  isWhitelistedStorage: boolean;
  media: NFTMedia[];
  metadata: NFTMetadata;
  name: string;
  nonce: number;
  royalties: number;
  tags: string[];
  ticker: string;
  timestamp: number;
  type: string;
  uris: string[];
  url: string;
}
