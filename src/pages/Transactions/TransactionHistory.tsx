import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { network } from 'config';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import TransactionDescription from './TransactionDescription';

const getDate = (unix_timestamp: any) => {
  const milliseconds = unix_timestamp * 1000;
  return new Date(milliseconds);
};

const dateFormat = 'MMM D, YYYY';

const TransactionHistory = () => {
  const currentContract = useSelector(currentMultisigContractSelector);
  const [allTransactions, setAllTransactions] = useState({});
  useEffect(() => {
    async function getAllTransactions() {
      return await axios.get(
        `${network.apiAddress}/transactions?receiver=${currentContract?.address}`
      );
    }

    getAllTransactions().then(({ data }) => {
      const groupedTransactions = data.reduce((acc: any, transaction: any) => {
        const dateOfTransaction = dayjs(getDate(transaction.timestamp)).format(
          dateFormat
        );

        console.log(
          dayjs.duration(-transaction.timestamp, 'milliseconds').humanize(true)
        );

        if (!acc[dateOfTransaction]) acc[dateOfTransaction] = [];
        acc[dateOfTransaction].push(transaction);

        return acc;
      }, {});

      console.log({ groupedTransactions });
      setAllTransactions(groupedTransactions);
    });
  }, []);

  return (
    <>
      {Object.entries(allTransactions).map(
        ([transactionDate, transactionArray]: any) => {
          return (
            <div key={transactionDate}>
              {
                <Typography variant='subtitle1' className='my-4'>
                  <strong>{transactionDate}</strong>
                </Typography>
              }
              {transactionArray.map((transaction: any) => {
                return (
                  <Accordion key={transaction.txHash}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='panel1a-content'
                      id='panel1a-header'
                    >
                      <Typography component='span'>
                        <strong> txHash:</strong>{' '}
                        {transaction.txHash.slice(0, 10)}...
                        {transaction.txHash.slice(
                          transaction.txHash.length - 10
                        )}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* {Object.entries(transaction).map(
                          ([property, value]: any) => (
                            <div key={property}>
                              <strong>{property}:</strong>
                              <h6>
                                {value.toString().slice(0, 20)}
                                {value.toString().length > 20 ? '[...]' : ''}
                              </h6>
                            </div>
                          )
                        )} */}
                      <TransactionDescription transaction={transaction} />
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          );
        }
      )}
    </>
  );
};

export default TransactionHistory;
