import { Box } from '@mui/system';
import { useTheme } from 'styled-components';
import { Text } from '../StyledComponents/StyledComponents';

type Props = {
  propertyKey: string
};

export const PropertyKeyBox = ({ propertyKey }: Props) => {
  const theme: any = useTheme();
  return (
    <Box>
      <Text sx={{
        color: theme.palette.text.homeCards,
        fontWeight: 500,
        fontSize: '14px',
        mr: 1,
      }}
      >{propertyKey }:
      </Text>
    </Box>
  );
};
