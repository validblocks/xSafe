import { useTranslation } from 'react-i18next';
import { MultisigCard, Text } from '../StyledComponents/StyledComponents';

interface Props {
    title: string;
    amountValue: string;
    amountUnityMeasure: string;
    actionButton?: React.ReactElement | null;
}

const AmountWithTitleCard = ({
  amountValue = '0',
  title = 'Unknown',
  amountUnityMeasure = '',
  actionButton = null,
}: Props) => {
  const { t } = useTranslation();
  return (
    <MultisigCard sx={{
      padding: '15px',
    }}
    >
      <Text fontSize="15px" color="black.main" marginBottom="12px">{t(title) as string}:</Text>
      <Text fontSize="24px" fontWeight="bolder">{amountValue} ${amountUnityMeasure}
      </Text>
      {actionButton}
    </MultisigCard>
  );
};

export default AmountWithTitleCard;
