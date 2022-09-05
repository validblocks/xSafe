import { Button, Card } from '@mui/material';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { isInReadOnlyModeSelector } from 'src/redux/selectors/accountSelector';

interface Props {
    imgUrl?: string;
    title?: string;
    description?: string;
  actionButtonText?: string;
  isInstallable: boolean;
    actionButtonOnClick?: () => void;
}

const AppCard = ({
  imgUrl,
  title,
  description,
  isInstallable,
  actionButtonText = 'Click me',
  actionButtonOnClick = () => null,
}: Props) => {
  const isInReadOnlyMode = useSelector(isInReadOnlyModeSelector);

  return (
    <Card sx={{ padding: '1rem', width: '250px' }}>
      <Box>
        <img
          className="mr-3 rounded w-100"
          src={imgUrl}
          alt="member"
        />
      </Box>
      <Box key={title} display="flex" flexDirection={'column'} marginY={1}>
        <Text fontSize={16} fontWeight={500}>{title}</Text>
      </Box>
      <Box key={description} display="flex" flexDirection={'column'} marginY={1}>
        {description}
      </Box>
      <Button
        onClick={actionButtonOnClick}
        sx={{ width: '100%' }}
        size="small"
        disabled={!isInstallable || isInReadOnlyMode}
        variant="outlined"
        color="primary"
      >{isInstallable ? actionButtonText : 'Coming Soon...'}
      </Button>
    </Card>
  );
};

export default AppCard;
