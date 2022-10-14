import { Box } from '@mui/material';
import { useTheme } from 'styled-components';
import { Text } from '../StyledComponents/StyledComponents';

interface PercentageWithIconProps {
    icon: React.ReactNode;
    percentage: string;
}

const PercentageWithIcon = ({ icon, percentage }: PercentageWithIconProps) => {
  const theme: any = useTheme();
  return (
    <Box sx={{ display: 'flex', gap: '2px' }}>
      <Text sx={{ color: `${theme.palette.text.primary} !important` }}>{icon}</Text>
      <Text
        fontSize={15}
        fontWeight={500}
        sx={{ color: `${theme.palette.text.primary} !important` }}
      >{percentage}%
      </Text>
    </Box>
  );
};

export default PercentageWithIcon;
