import { Box } from '@mui/system';
import { PropertyKeyBox } from '../Utils/PropertKeyBox';
import { PropertyValueBox } from '../Utils/PropertyValueBox';

type Props = {
  parsedArgs: {
    properties: Record<string, boolean>;
    tokenTicker: string;
    tokenName: string;
  };
};

const IssueNftCollectionProposalPresentation = ({
  parsedArgs: { properties, tokenTicker, tokenName },
}: Props) => (
  <Box>
    <Box display="flex">
      <PropertyKeyBox propertyKey={'Token Name'} />
      <PropertyValueBox value={tokenName} />
    </Box>
    <Box>
      <PropertyKeyBox propertyKey={'Properties'} />
      <Box px={2}>
        {Object.entries(properties).map(([key, value]: [string, boolean]) => (
          <Box key={key} display="flex">
            <PropertyKeyBox propertyKey={key} />
            <PropertyValueBox value={value.toString()} />
          </Box>
        ))}
      </Box>
    </Box>
    <Box display="flex">
      <PropertyKeyBox propertyKey={'Token Ticker'} />
      <PropertyValueBox value={tokenTicker} />
    </Box>
  </Box>
);

export default IssueNftCollectionProposalPresentation;
