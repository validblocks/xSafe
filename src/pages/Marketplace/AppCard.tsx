import { Box, useMediaQuery } from '@mui/material';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useTheme } from 'styled-components';
import { useOrganizationInfoContext } from '../Organization/OrganizationInfoContextProvider';
import * as Styled from './styled';

interface Props {
    imgUrl?: string;
    title?: string;
    description?: string;
  actionButtonText?: string;
  isInstallable: boolean;
  isInstalled: boolean;
  actionButtonOnClick?: () => void;
  actionButtonOnPin?: () => void;
  pinStatus?: boolean;
}

const AppCard = ({
  imgUrl,
  title,
  description,
  isInstallable,
  isInstalled,
  actionButtonText = 'Click me',
  actionButtonOnClick = () => null,
  actionButtonOnPin = () => null,
  pinStatus,
}: Props) => {
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const theme: any = useTheme();
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  return (
    <Styled.AppCard>
      <img
        className="rounded w-100"
        src={imgUrl}
        alt="member"
      />
      <Text fontSize={20} fontWeight={500} margin="12px 0px 6px">{title}</Text>
      <Text fontSize={15} fontWeight={400} marginBottom={'12px'}>{description}</Text>
      <Box
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        marginTop={'auto'}
      >
        <Styled.InstallButton
          onClick={actionButtonOnClick}
          sx={{
            ...(isInstalled && {
              backgroundColor: `${theme.palette.background.button} !important`,
              border: `1px solid ${theme.palette.background.button} !important`,
              color: '#fff !important',
            }),
            marginRight: isInstallable && isInstalled && maxWidth600 ? '12px' : '0',
          }}
          disabled={!isInstallable || isInReadOnlyMode || title === 'Marketplace'}
        >{isInstallable ? actionButtonText : 'Coming Soon...'}
        </Styled.InstallButton>
        {isInstallable && maxWidth600 && isInstalled ? (
          <Styled.PinButton
            onClick={actionButtonOnPin}
          >
            {pinStatus ? 'Pinned' : 'Pin App'}
          </Styled.PinButton>
        ) : ''}
      </Box>

    </Styled.AppCard>
  );
};

export default AppCard;
