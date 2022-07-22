import { Box } from '@mui/material';
import AssetsTable from '../Assets/AssetsTable';
import MyClaimableRewards from './MyClaimableRewards';
import MyTotalStake from './MyTotalStake';

const MyStake = () => (
  <>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', padding: '12px 0', gap: '12px' }}>
      <MyTotalStake />
      <MyClaimableRewards />
    </Box>
    <Box>
      <AssetsTable hasStakingActions />
    </Box>
  </>
);

export default MyStake;
