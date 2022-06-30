import React from 'react';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { CenteredBox } from 'components/StyledComponents/StyledComponents';

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
      <Box sx={{ marginLeft: '10px' }}>{t(`Loading ${dataName}s`)}...</Box>
    </CenteredBox>
  );
};

export default LoadingDataIndicator;
