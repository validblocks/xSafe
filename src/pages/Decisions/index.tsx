import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import DecisionsActionsCards from 'components/DecisionsComponents/decisionsActionsCards';
import DecisionsHeader from 'components/DecisionsComponents/DecisionsHeader';
import DecisionsStatus from 'components/DecisionsComponents/decisionsStatus';
import ProgressBarsSection from 'components/DecisionsComponents/progressBarsSection';
import './decisions.scss';
import PageBreadcrumbs from 'components/Layout/Breadcrumb';

const Decisions = () => {
  return (
    <div>
      <Box
        className={
          'd-flex flex-fill justify-content-center align-items-center flex-column decisions-wrapper'
        }
      >
        <PageBreadcrumbs />
        <DecisionsHeader />
        <ProgressBarsSection />
        <DecisionsStatus />
        <DecisionsActionsCards />
      </Box>
    </div>
  );
};

export default Decisions;
