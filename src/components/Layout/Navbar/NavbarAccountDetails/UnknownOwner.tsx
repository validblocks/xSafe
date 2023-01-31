import { Box } from '@mui/system';
import { HtmlTooltip } from 'src/components/Utils/HtmlTooltip';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';

import { ModalTypes } from 'src/types/Proposals';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { MembersBox } from '../navbar-style';

const UnknownOwner = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleUnknownOwnerClick = useCallback(async () => {
    dispatch(setProposeModalSelectedOption({ option: ModalTypes.change_owner }));
  }, [dispatch]);

  return (
    <Box>
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
        <Box
          sx={{ cursor: 'pointer' }}
          position="absolute"
          top="-1.4rem"
          right="-.15rem"
          onClick={handleUnknownOwnerClick}
        >
          <MembersBox>
            <Typography>
              <PriorityHighIcon color="warning" sx={{ marginTop: '-3px', fontSize: '15px' }} />
            </Typography>
          </MembersBox>
        </Box>
      </HtmlTooltip>
    </Box>
  );
};

export default UnknownOwner;
