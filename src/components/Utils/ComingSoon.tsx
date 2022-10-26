import { CenteredBox, Text } from 'src/components/StyledComponents/StyledComponents';
import ClockPng from 'src/assets/img/Clock.png';

const ComingSoon = () => (
  <CenteredBox flexDirection="column" gap={1}>
    <img width={30} height={30} src={ClockPng} alt="clock" />
    <Text textAlign="center" fontWeight={600}>Help Center is coming soon!</Text>
  </CenteredBox>
);

export default ComingSoon;
