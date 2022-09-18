import { Skeleton } from '@mui/material';
import { MultisigCard } from '../StyledComponents/StyledComponents';

export const CardSkeleton = () => (
  <MultisigCard sx={{
    padding: '10px 15px 3px',
    opacity: '0.5',
  }}
  >
    <Skeleton width={'75%'} height={'34px'} sx={{ marginTop: '-5px' }} />
    <Skeleton width={'50%'} height={56} sx={{ marginTop: '-3px' }} />
    <Skeleton width={'100%'} height={62} sx={{ marginTop: '-5px' }} />
  </MultisigCard>
);
