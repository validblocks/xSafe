import { Typography, useMediaQuery } from '@mui/material';
import { useCustomTheme } from 'src/hooks/useCustomTheme';

interface Props {
  value: number;
  type: string;
}

const DateTimeDisplay = ({ value, type }: Props) => {
  const theme = useCustomTheme();
  const maxWidth600 = useMediaQuery('(max-width: 600px)');
  if (value === 0) return <span />;
  return (
    <Typography
      fontSize={maxWidth600 ? 14 : 11}
      sx={{ color: theme.palette.text.primary }}
      component="span"
    >
      {value}
      {type}
    </Typography>
  );
};

export default DateTimeDisplay;
