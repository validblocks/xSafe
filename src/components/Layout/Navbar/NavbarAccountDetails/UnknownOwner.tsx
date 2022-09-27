import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { HtmlTooltip } from 'src/components/Utils/HtmlTooltip';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useTranslation } from 'react-i18next';
import { MembersBox } from '../navbar-style';

const UnknownOwner = () => {
  const { t } = useTranslation();

  return (
    <HtmlTooltip
      disableFocusListener
      disableTouchListener
      title={(
        <Box display={'flex'}>
          <span className="ml-1">{t('Contract has an unknown owner!') as string}</span>
        </Box>
        )}
      placement="bottom"
    >
      <Box position="absolute" top="-1.4rem" right="-.15rem">
        <MembersBox>
          <Typography>
            <PriorityHighIcon color="warning" sx={{ marginTop: '-3px', fontSize: '15px' }} />
          </Typography>
        </MembersBox>
      </Box>
    </HtmlTooltip>
  );
};

export default UnknownOwner;
