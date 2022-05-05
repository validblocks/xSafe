import React from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { truncateInTheMiddle } from 'utils/addressUtils';
import { getDate } from 'utils/transactionUtils';

type Props = {
  transaction: any;
};

const TransactionSummary = ({ transaction }: Props) => {
  return (
    <>
      <div className='d-flex'>
        <Typography
          component='span'
          className='d-flex align-items-center justify-content-center'
          sx={{
            borderRight: '2px solid #eee',
            padding: '1rem'
          }}
        >
          {transaction.nonce}
        </Typography>

        <Typography
          component='span'
          className='d-flex align-items-center justify-content-center'
          sx={{
            borderRight: '2px solid #eee',
            padding: '1rem',
            fontWeight: 'bold'
          }}
        >
          {transaction?.function}
        </Typography>

        <Typography
          component='span'
          sx={{
            borderRight: '2px solid #eee',
            padding: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center'
          }}
        >
          <div>
            <strong>Execution Time:</strong>
          </div>
          {dayjs(getDate(transaction.timestamp)).format('H:mm A')}
        </Typography>

        <Typography
          component='span'
          sx={{
            padding: '1rem',
            fontSize: '0.85rem'
          }}
        >
          <div>
            <strong>Executed by:</strong>
          </div>
          <div className='d-flex align-items-center mt-1'>
            <img
              className='mr-2 rounded'
              src='https://picsum.photos/20/20?random=1'
            />
            {truncateInTheMiddle(transaction.sender, 10)}
          </div>
        </Typography>
      </div>
      <Box
        className='d-flex'
        sx={{
          borderLeft: '2px solid #eee',
          padding: '1rem',
          fontSize: '0.85rem'
        }}
      >
        <div className='mx-3 d-flex align-items-center justify-content-end'>
          <Box
            sx={{
              backgroundColor: '#17d297',
              color: '#fff',
              borderRadius: '4px',
              padding: '0.5rem 0.675rem',
              fontWeight: 'bold'
            }}
          >
            {transaction.status}
          </Box>
        </div>
      </Box>
    </>
  );
};

export default TransactionSummary;
