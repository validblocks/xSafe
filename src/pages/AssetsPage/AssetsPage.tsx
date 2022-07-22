import { Box } from '@mui/system';
import AssetsTable from 'src/components/Assets/AssetsTable';

const AssetsPage = () => (
  <Box
    sx={{
      width: '100%',
      padding: '2rem',
    }}
  >
    <AssetsTable />
  </Box>
);

export default AssetsPage;
