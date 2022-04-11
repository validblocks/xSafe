import React from 'react';
import LanIcon from '@mui/icons-material/Lan';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Button, Row } from 'react-bootstrap';
import LinearWithValueLabel from 'components/ProgressBar/progressLinear';

const DecisionsActionsCards = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: 'unset'
  }));

  const actionCardsArray = [
    {
      title: 'Add board member to organization',
      date: '27/06/2022',
      icon: <LanIcon />,
      id: '#6',
      url: 'https://raw.example.com...',
      progress: <LinearWithValueLabel />,
      type: 'Organization'
    },
    {
      title: 'Make new payment',
      date: '27/06/2022',
      icon: <LanIcon />,
      id: '#4',
      url: 'https://raw.example.com...',
      progress: <LinearWithValueLabel />,
      type: 'Tokens'
    },
    {
      title: 'Create new token',
      date: '27/06/2022',
      icon: <LanIcon />,
      id: '#3',
      url: 'https://raw.example.com...',
      progress: <LinearWithValueLabel />,
      type: 'Payments'
    }
  ];
  return (
    <Grid container spacing={2}>
      {actionCardsArray.map((item, index) => {
        return (
          <Grid key={index} item md={4} xs={12}>
            <Item className='action-cards'>
              <div className='top-header'>
                <Button
                  disabled={true}
                  className='inline-class organization-btn'
                >
                  {item.icon}
                  {item.type}
                </Button>
                <Typography align='right' className='inline-class box-number'>
                  {item.id}
                </Typography>
              </div>
              <div className='title-date'>
                <Typography className='actions-title' align='left' variant='h6'>
                  {item.title}
                </Typography>
                <Typography align='left' variant='inherit'>
                  Due: {item.date}
                </Typography>
              </div>
              <Typography align='left' variant='inherit'>
                Link: {item.url}
              </Typography>
              <LinearWithValueLabel />
            </Item>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DecisionsActionsCards;
