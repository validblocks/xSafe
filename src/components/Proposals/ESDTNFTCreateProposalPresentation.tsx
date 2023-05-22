import { Box } from '@mui/system';
import { PropertyKeyBox } from '../Utils/PropertKeyBox';
import { PropertyValueBox } from '../Utils/PropertyValueBox';

type Props = {
  parsedArgs: {
    attributes: {
      tags: string[];
      metadata: string[];
    };
    nftIdentifier: string;
    nftName: string;
    royalties: number;
    initialQuantity: number;
    uris: string[];
  }
};

const ESDTNFTCreateProposalPresentation = ({ parsedArgs: {
  attributes: {
    tags,
    metadata,
  },
  nftIdentifier,
  nftName,
  royalties,
  initialQuantity,
  uris,
} }: Props) => (
  <Box>
    <Box display="flex">
      <PropertyKeyBox propertyKey={'NFT Name'} />
      <PropertyValueBox value={nftName} />
    </Box>
    <Box display="flex">
      <PropertyKeyBox propertyKey={'NFT Identifier'} />
      <PropertyValueBox value={nftIdentifier} />
    </Box>
    <Box display="flex">
      <PropertyKeyBox propertyKey={'Royalties'} />
      <PropertyValueBox value={`${royalties.toString()}%`} />
    </Box>
    <Box display="flex">
      <PropertyKeyBox propertyKey={'Initial Quantity'} />
      <PropertyValueBox value={initialQuantity.toString()} />
    </Box>
    {uris?.[0] && (
    <Box display="flex">
      <PropertyKeyBox propertyKey={'URI'} />
      <PropertyValueBox value={uris?.[0]} />
    </Box>
    )}
    {tags && (
    <Box display="flex">
      <PropertyKeyBox propertyKey={'Tags'} />
      <PropertyValueBox value={tags?.join(', ')} />
    </Box>
    )}
    {metadata && (
    <Box display="flex">
      <PropertyKeyBox propertyKey={'Metadata'} />
      <PropertyValueBox value={metadata?.join(', ')} />
    </Box>
    )}
  </Box>
);

export default ESDTNFTCreateProposalPresentation;
