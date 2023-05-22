import { Box } from '@mui/material';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { NoActionsOverlayCard } from 'src/pages/Transactions/styled';

const ExampleApp = () => (
  <Box>
    <NoActionsOverlayCard>
      <Text>
        This is my awesome app
      </Text>
    </NoActionsOverlayCard>
  </Box>
);

export default ExampleApp;
