import { useTranslation } from 'react-i18next';
import { MultisigCard, Text } from '../StyledComponents/StyledComponents';

const MyClaimableRewards = () => {
  const { t } = useTranslation();
  return (
    <MultisigCard sx={{
      padding: '15px',
    }}
    >
      <Text fontSize="15px" color="black.main" marginBottom="12px">{t('My claimable rewards') as string}:</Text>
      <Text fontSize="24px" fontWeight="bolder">${'244.43'}</Text>
    </MultisigCard>
  );
};

export default MyClaimableRewards;
