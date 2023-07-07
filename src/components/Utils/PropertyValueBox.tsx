import { Box } from '@mui/system';
import { useCustomTheme } from 'src/utils/useCustomTheme';
import { Text } from '../StyledComponents/StyledComponents';

type Props = {
  value: string
};

export const PropertyValueBox = ({ value }: Props) => {
  const theme = useCustomTheme();
  return (
    <Box>
      <Text sx={{
        color: theme.palette.text.primary,
        fontWeight: 400,
        mr: 1,
      }}
      >{value }
      </Text>
    </Box>
  );
};
