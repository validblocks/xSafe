import { Box } from '@mui/system';
import { useTheme } from 'styled-components';
import { Text } from '../StyledComponents/StyledComponents';

type Props = {
  value: string
};

export const PropertyValueBox = ({ value }: Props) => {
  const theme: any = useTheme();
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
