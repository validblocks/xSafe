import { Box } from '@mui/material';
import NoActionsOverlay from 'src/pages/Transactions/utils/NoActionsOverlay';

const AppNotInstalled = () => (
  <Box>
    <NoActionsOverlay message="You first need to install the app." />
  </Box>
);

export default AppNotInstalled;
