import ComingSoon from 'src/components/Utils/ComingSoon';
import { ComingSoonCardWrapper, HelpCenterWrapper } from './styled';

const HelpCenter = () => (
  <HelpCenterWrapper>
    <ComingSoonCardWrapper>
      <ComingSoon />
    </ComingSoonCardWrapper>
  </HelpCenterWrapper>
);

export default HelpCenter;
