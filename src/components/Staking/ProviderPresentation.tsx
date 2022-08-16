import { Box } from '@mui/material';
import { IdentityWithColumns } from 'src/types/staking';
import APRColumn from './APRColumn';
import FilledColumn from './FilledColumn';
import ProviderColumn from './ProviderColumn';

interface Props {
    provider?: IdentityWithColumns
}

const ProviderPresentation = ({ provider }: Props) => {
  if (!provider) {
    return <div>No provider to show</div>;
  }
  return (
    <Box height={68} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <ProviderColumn columnData={provider.providerColumn} />
      <APRColumn columnData={provider.aprColumn} />
      <FilledColumn columnData={provider.filledColumn} />
    </Box>
  );
};

export default ProviderPresentation;
