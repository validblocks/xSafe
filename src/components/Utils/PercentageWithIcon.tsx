import { CenteredBox, Text } from '../StyledComponents/StyledComponents';

interface PercentageWithIconProps {
    icon: React.ReactNode;
    percentage: string;
}

const PercentageWithIcon = ({ icon, percentage }: PercentageWithIconProps) => (
  <CenteredBox sx={{ gap: '2px', width: '100%' }}>
    {percentage !== '∞' && <Text>{icon}</Text>}
    <Text fontSize={15} fontWeight={500} textAlign="center">
      {Number(percentage) > 100 ? '100' : percentage}
      {percentage !== '∞' && '%'}
    </Text>
  </CenteredBox>
);

export default PercentageWithIcon;
