import { Box } from '@mui/system';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { CenteredBox } from 'src/components/StyledComponents/StyledComponents';

type Props = {
  dataName: string;
};

const ErrorOnFetchIndicator = ({ dataName }: Props) => {
  const t = useCustomTranslation();
  return (
    <CenteredBox
      sx={{ justifyContent: 'start !important', marginTop: '1.5rem' }}
    >
      <Box sx={{ marginLeft: '10px' }}>
        {t(`Error fetching ${dataName}s`) as string}.
      </Box>
    </CenteredBox>
  );
};

export default ErrorOnFetchIndicator;
