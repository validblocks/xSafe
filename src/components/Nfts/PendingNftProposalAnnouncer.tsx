import { Box } from '@mui/material';
import { Text } from '../StyledComponents/StyledComponents';

const PendingNftProposalAnnouncer = () => (
  <Box
    sx={{
      position: 'absolute',
      color: '#fff',
      left: '-10px',
      top: '-10px',
      zIndex: '1',
      display: 'flex',
      padding: '3px 8px',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#4c2FFC',
      borderRadius: '4px',
      cursor: 'pointer',
    }}
  >
    <Text fontSize="10px" fontWeight="700">Proposal pending</Text>
  </Box>
);

export default PendingNftProposalAnnouncer;
