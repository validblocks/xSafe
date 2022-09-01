import { useState } from 'react';
import { Accordion, useAccordionToggle } from 'react-bootstrap';
import { ProposalsTypes } from 'src/types/Proposals';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { Box, Typography } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

interface SelectOptionPropsType {
  onSelected: (option: ProposalsTypes) => void;
}

const proposeAvailableOptions = [
  {
    type: ProposalsTypes.send_egld,
    label: 'Send EGLD',
  },
  {
    type: ProposalsTypes.send_token,
    label: 'Send token',
  },

  {
    type: ProposalsTypes.smart_contract_call,
    label: 'Smart contract call',
  },
];

const othersAvailableOptions = [
  {
    type: ProposalsTypes.issue_token,
    label: 'Issue token',
  },
  {
    type: ProposalsTypes.deploy_contract_from_source,
    label: 'Deploy Contract from source',
  },
  {
    type: ProposalsTypes.upgrade_contract_from_source,
    label: 'Upgrade Contract from source',
  },
  {
    type: ProposalsTypes.attach_contract,
    label: 'Attach smart contract',
  },
];

export default function SelectOption({ onSelected }: SelectOptionPropsType) {
  const [expanded, setExpanded] = useState(false);
  const handleToggleExpanded = () => setExpanded((prev) => !prev);

  const decoratedOnClick = useAccordionToggle('0', handleToggleExpanded);
  return (
    <Box sx={{ px: '2.75rem', pt: '1.8rem' }}>
      <div className="card select-options-list">
        {proposeAvailableOptions.map((option) => (
          <MainButton
            key={option.type}
            onClick={() => onSelected(option.type)}
            sx={{ mb: '1rem', boxShadow: 'none !important' }}
          >
            {option.label}
          </MainButton>
        ))}
      </div>
      <div className="card select-options-list">
        <Accordion>
          <Box sx={{ '& button[tabindex="-1"]:focus:not(:focus-visible)': { outline: 'none !important' } }}>
            <Accordion.Toggle
              eventKey="0"
              onClick={decoratedOnClick}
              className="expand-icon advanced-options-toggle mb-2 shadow-none"
              tabIndex={-1}
            >
              <div className="d-flex justify-content-center align-items-center flex-fill">
                <Typography color="#4c2ffc" className="h6 mb-1" data-testid="delegateTitle">
                  Advanced
                </Typography>
                <ArrowDropDown
                  className={expanded ? 'down' : 'up'}
                  sx={{
                    mb: '0.2rem',
                    transition: 'transform .3s linear',
                    color: '#4c2ffc',
                    '&.up': {
                      transform: 'rotate(-180deg)',
                    },
                  }}
                />
              </div>
            </Accordion.Toggle>
          </Box>

          <Accordion.Collapse eventKey="0">
            <Box
              className="d-flex flex-column"
              sx={{ '& > button.MuiButton-root:nth-of-type(4)': { mb: '0' } }}
            >
              {othersAvailableOptions.map((option) => (
                <MainButton
                  key={option.type}
                  onClick={() => onSelected(option.type)}
                  sx={{ mb: '1rem', boxShadow: 'none !important' }}
                >
                  {option.label}
                </MainButton>
              ))}
            </Box>
          </Accordion.Collapse>
        </Accordion>
      </div>
    </Box>
  );
}
