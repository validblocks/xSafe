import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { Text, CenteredBox } from 'src/components/StyledComponents/StyledComponents';

type Props = {
  dataName: string;
};

const LoadingDataIndicator = ({ dataName }: Props) => {
  const { t } = useTranslation();
  return (
    <CenteredBox
      sx={{ justifyContent: 'start !important', marginTop: '1.5rem' }}
    >
      <CircularProgress />
      <Box sx={{ marginLeft: '10px' }}><Text>{t(`Loading ${dataName}s`) as string}...</Text></Box>
    </CenteredBox>
  );
};

export default LoadingDataIndicator;
