import { CircularProgress, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { Text, CenteredBox } from 'src/components/StyledComponents/StyledComponents';
import { useTheme } from 'styled-components';

type Props = {
  dataName: string;
};

const LoadingDataIndicator = ({ dataName }: Props) => {
  const { t } = useTranslation();
  const data = dataName.length > 0 ? `${dataName}s` : dataName;
  const loadingMessage = `Loading ${data}...`;
  const theme: any = useTheme();
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  return (
    <CenteredBox
      sx={{
        justifyContent: maxWidth600 ? 'center !important' : 'start !important',
        marginTop: '1.5rem',
        height: maxWidth600 ? '200px' : 'auto',
      }}
    >
      <CircularProgress sx={{ color: theme.palette.background.transactionsExpand }} />
      <Box sx={{ marginLeft: '10px' }}><Text fontWeight={500}>{t(loadingMessage) as string}</Text></Box>
    </CenteredBox>
  );
};

export default LoadingDataIndicator;
