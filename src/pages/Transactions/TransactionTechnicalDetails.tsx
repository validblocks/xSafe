import React, { useCallback, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import TransactionAdvancedDetails from './TransactionAdvancedDetails';

type Props = any;

const TransactionTechnicalDetails = ({ transaction }: Props) => {
  const [isAdvancedDetailsVisibile, setIsAdvancedDetailsVisible] =
    useState(false);
  const toggleAdvancedDetails = useCallback(
    () => setIsAdvancedDetailsVisible((currentState) => !currentState),
    []
  );
  console.log({ transaction });
  //   return <div>{JSON.stringify(transaction)}</div>;
  return (
    <Box sx={{ padding: '1rem' }}>
      <Typography component='div' variant='body1' className='my-1'>
        <Typography
          component='span'
          className='mr-2'
          variant='body1'
          sx={{
            color: 'rgb(93, 109, 116)',
            letterSpacing: 0.5
          }}
        >
          Transaction Hash:
        </Typography>
        {transaction?.txHash.slice(0, 15)}...
        {transaction?.txHash.slice(transaction?.txHash.length - 15)}
      </Typography>
      <Typography component='div' className='my-1'>
        <Typography
          component='span'
          className='mr-2'
          variant='body1'
          sx={{
            color: 'rgb(93, 109, 116)',
            letterSpacing: 0.5
          }}
        >
          Action Name:{' '}
        </Typography>
        {transaction?.action.name}
      </Typography>
      <Typography component='div' className='my-1'>
        <Typography
          component='span'
          className='mr-2'
          variant='body1'
          sx={{
            color: 'rgb(93, 109, 116)',
            letterSpacing: 0.5
          }}
        >
          Action Category:{' '}
        </Typography>
        {transaction?.action.category}
      </Typography>
      <Button
        variant='text'
        className='px-0'
        onClick={() => toggleAdvancedDetails()}
        sx={{
          color: 'rgb(93, 109, 116)',
          textDecoration: 'underline',
          '&:hover': {
            textDecoration: 'underline',
            backgroundColor: 'transparent'
          }
        }}
      >
        Advanced details
      </Button>

      {isAdvancedDetailsVisibile && (
        <TransactionAdvancedDetails transaction={transaction} />
      )}
    </Box>
  );
};

export default TransactionTechnicalDetails;
