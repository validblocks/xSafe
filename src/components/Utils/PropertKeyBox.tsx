import { Box } from '@mui/system';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { Text } from '../StyledComponents/StyledComponents';

type Props = {
  propertyKey: string;
};

export const PropertyKeyBox = ({ propertyKey }: Props) => {
  const theme = useCustomTheme();
  return (
    <Box>
      <Text
        sx={{
          color: theme.palette.text.homeCards,
          fontWeight: 500,
          fontSize: '14px',
          mr: 1,
        }}
      >
        {propertyKey}:
      </Text>
    </Box>
  );
};
