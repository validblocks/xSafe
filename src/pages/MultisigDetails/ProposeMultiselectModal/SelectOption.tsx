import { useState } from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, useAccordionToggle } from 'react-bootstrap';
import { ProposalsTypes } from 'src/types/Proposals';
import { MainButton } from 'src/components/Theme/StyledComponents';
import { Box } from '@mui/material';

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
          <Accordion.Toggle
            eventKey="0"
            onClick={decoratedOnClick}
            className="expand-icon advanced-options-toggle mb-2"
          >
            <div className="d-flex justify-content-center align-items-center flex-fill">
              <span className="h6 mb-1 mr-2" data-testid="delegateTitle">
                Advanced
              </span>
              <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
            </div>
          </Accordion.Toggle>
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
