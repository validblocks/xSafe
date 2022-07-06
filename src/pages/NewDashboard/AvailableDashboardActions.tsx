import { useMemo } from 'react';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Box, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import MembersActionCard from 'src/pages/Organization/MembersActionCard';

function AvailableDashboardActions() {
  const isSmallScreen = useMediaQuery('(max-width:920px)');

  const useStyles: CallableFunction = useMemo(
    () =>
      makeStyles({
        container: {
          width: '100%',
          display: 'grid',
          gridTemplateColumns: isSmallScreen ? '1fr' : '1fr 1fr 1fr',
          gridGap: isSmallScreen ? '1.8rem' : '2.5rem 4rem',
          margin: '40px 0',
        },
        child1: {
          gridRow: '1 / 2',
          gridColumn: '1 / 2',
        },
        child2: {
          gridRow: isSmallScreen ? '2 / 3' : '1 / 2',
          gridColumn: isSmallScreen ? '1 / 2' : '2 / 3',
        },
        child3: {
          gridRow: isSmallScreen ? '3 / 4' : '1 / 2',
          gridColumn: isSmallScreen ? '1 / 2' : '3 / 4',
        },
        child4: {
          gridRow: isSmallScreen ? '4 / 5' : '2 / 3',
          gridColumn: '1 / 2',
        },
        child5: {
          gridRow: isSmallScreen ? '5 / 6' : '2 / 3',
          gridColumn: isSmallScreen ? '1 / 2' : '2 / 3',
        },
        child6: {
          gridRow: isSmallScreen ? '6 / 7' : '2 / 3',
          gridColumn: isSmallScreen ? '1 / 2' : '3 / 4',
        },
      }),
    [isSmallScreen],
  );

  const membersActionCards = [
    {
      title: 'Access vault',
      icon: <FactCheckIcon fontSize="large" htmlColor="#1390ff" />,
      buttonBackground: '#F3F9FF',
      description: 'View and track all assets and transfers',
      hoverColor: '#1390ff',
      onClickHandler: () => ({}),
    },
    {
      title: 'Take decisions',
      icon: <ThumbUpAltIcon fontSize="large" htmlColor="#16d296" />,
      buttonBackground: '#f3fdfa',
      description: 'Propose and vote on decisions',
      hoverColor: '#16d296',
      onClickHandler: () => ({}),
    },
    {
      title: 'Create payment',
      icon: <CreditCardIcon fontSize="large" htmlColor="#edb636" />,
      buttonBackground: '#fcb35f28',
      description: 'Make deposits or withdrawals',
      hoverColor: '#edb636',
      onClickHandler: () => ({}),
    },
    {
      title: 'Create new token',
      icon: <CreditCardIcon fontSize="large" htmlColor="#711eec" />,
      buttonBackground: '#701eec1a',
      description: 'Make deposits or withdrawals',
      hoverColor: '#711eec',
      onClickHandler: () => ({}),
    },
    {
      title: 'Change organization structure',
      icon: <AddReactionIcon fontSize="large" htmlColor="#dc3545" />,
      buttonBackground: '#f9f2f2',
      description: 'Change user permissions',
      hoverColor: '#dc3545',
      onClickHandler: () => ({}),
    },
  ];

  const classes = useStyles();
  return (
    <>
      <h2>
        <strong>What do you want to do?</strong>
      </h2>
      <Box className={classes.container}>
        {membersActionCards.map((item, idx) => (
          <Box
            key={item.title}
            className={classes[idx]}
            sx={{ minHeight: '130px !important' }}
          >
            <MembersActionCard
              buttonBackground={item.buttonBackground}
              icon={item.icon}
              description={item.description}
              title={item.title}
              onClickHandler={item.onClickHandler}
              hoverColor={`${item.hoverColor}!important`}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}

export default AvailableDashboardActions;
