import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { CenteredBox } from 'src/components/StyledComponents/StyledComponents';

type Props = {
  dataName: string;
};

const ErrorOnFetchIndicator = ({ dataName }: Props) => {
  const { t } = useTranslation();
  return (
    <CenteredBox
      sx={{ justifyContent: 'start !important', marginTop: '1.5rem' }}
    >
      <Box sx={{ marginLeft: '10px' }}>{t(`Error fetching ${dataName}s`) as string}.</Box>
    </CenteredBox>
  );
};

export default ErrorOnFetchIndicator;
