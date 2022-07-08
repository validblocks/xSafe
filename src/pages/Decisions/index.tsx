import { Box } from '@mui/material';
import DecisionsActionsCards from 'src/components/DecisionsComponents/decisionsActionsCards';
import DecisionsHeader from 'src/components/DecisionsComponents/DecisionsHeader';
import DecisionsStatus from 'src/components/DecisionsComponents/decisionsStatus';
import ProgressBarsSection from 'src/components/DecisionsComponents/progressBarsSection';
import './decisions.scss';

const Decisions = () => (
  <div>
    <Box className="d-flex flex-fill justify-content-center align-items-center flex-column decisions-wrapper">
      <DecisionsHeader />
      <ProgressBarsSection />
      <DecisionsStatus />
      <DecisionsActionsCards />
    </Box>
  </div>
);

export default Decisions;
