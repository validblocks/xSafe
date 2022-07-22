import { Box } from '@mui/material';
import { Text } from '../StyledComponents/StyledComponents';

interface PercentageWithIconProps {
    icon: React.ReactNode;
    percentage: string;
}

const PercentageWithIcon = ({ icon, percentage }: PercentageWithIconProps) => (
  <Box sx={{ display: 'flex', gap: '2px' }}>
    {icon}
    <Text fontSize={15} fontWeight={500} sx={{ color: '#08041D !important' }}>{percentage}%</Text>
  </Box>
);

export default PercentageWithIcon;
