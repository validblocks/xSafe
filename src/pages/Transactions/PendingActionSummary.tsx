import React from 'react';
import { Ui } from '@elrondnetwork/dapp-utils';
import PeopleIcon from '@mui/icons-material/People';
import { Box } from '@mui/system';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { MultisigActionDetailed } from 'types/MultisigActionDetailed';

type Props = {
  action: MultisigActionDetailed;
};

const PendingActionSummary = ({ action }: Props) => {
  const {
    quorumCountState: [quorumCount]
  } = useOrganizationInfoContext();
  return (
    <>
      <Box className='d-flex'>
        <Box
          className='d-flex align-items-center justify-content-center w-100'
          sx={{
            borderRight: '2px solid #dddddd',
            padding: '1rem',
            minWidth: '60px'
          }}
        >
          {action?.actionId}
        </Box>

        <Box
          className='d-flex align-items-center justify-content-start'
          sx={{
            borderRight: '2px solid #ddd',
            padding: '1rem',
            fontWeight: 'bold',
            minWidth: '230px'
          }}
        >
          {action?.title()}
        </Box>

        <Box
          sx={{
            borderRight: '2px solid #ddd',
            padding: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            minWidth: '150px'
          }}
        >
          <PeopleIcon color='primary' className='mr-2' />
          <strong>
            {action.signers.length} out of {quorumCount}
          </strong>
        </Box>

        <Box
          sx={{
            padding: '1rem',
            fontSize: '0.85rem',
            flex: 1
          }}
        >
          <div>
            <strong>Created by:</strong>
          </div>
          <div className='d-flex align-items-center mt-1'>
            <img
              className='mr-2 rounded'
              src='https://picsum.photos/20/20?random=1'
            />
            <Ui.Trim text={action.signers[0]?.bech32() ?? 'Unknown'} />
          </div>
        </Box>
      </Box>
      <Box
        className='d-flex'
        sx={{
          borderLeft: '2px solid #ddd',
          padding: '1rem',
          fontSize: '0.85rem'
        }}
      >
        <div className='mx-3 d-flex align-items-center justify-content-end'>
          <Box
            sx={{
              backgroundColor: '#f8c651',
              color: '#fff',
              borderRadius: '4px',
              padding: '0.5rem 0.675rem',
              fontWeight: 'bold'
            }}
          >
            Pending
          </Box>
        </div>
      </Box>
    </>
  );
};

export default PendingActionSummary;
