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
}

const AppCard = ({
  imgUrl,
  title,
  description,
  isInstallable,
  isInstalled,
  actionButtonText = 'Click me',
  actionButtonOnClick = () => null,
}: Props) => {
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const theme: any = useTheme();

  return (
    <Styled.AppCard>
      <img
        className="mr-3 rounded w-100"
        src={imgUrl}
        alt="member"
      />
      <Text fontSize={20} fontWeight={500} marginBottom="-5px">{title}</Text>
      <Text fontSize={15} fontWeight={400}>{description}</Text>
      <Styled.InstallButton
        onClick={actionButtonOnClick}
        sx={{
          ...(isInstalled && {
            backgroundColor: `${theme.palette.background.button} !important`,
            border: `1px solid ${theme.palette.background.button} !important`,
            color: '#fff !important',
          }),
        }}
        disabled={!isInstallable || isInReadOnlyMode || title === 'Marketplace'}
      >{isInstallable ? actionButtonText : 'Coming Soon...'}
      </Styled.InstallButton>
    </Styled.AppCard>
  );
};

export default AppCard;
