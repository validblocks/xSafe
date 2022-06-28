import React, { useMemo } from 'react';

import AddReactionIcon from '@mui/icons-material/AddReaction';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Box, Grid, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import { setProposeModalSelectedOption } from 'redux/slices/modalsSlice';
import { ProposalsTypes } from 'types/Proposals';
import MembersActionCard from './MembersActionCard';
import MembersCard from './MembersCard';
import MembersTable from './MembersTable';

function OrganizationContent() {
  const dispatch = useDispatch();
  const onAddBoardMember = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.add_board_member
      })
    );
  const onAddProposers = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.add_proposer
      })
    );

  const onChangeQuorum = () =>
    dispatch(
      setProposeModalSelectedOption({
        option: ProposalsTypes.change_quorum
      })
    );

  const membersActionCards = [
    {
      title: 'Add Board Member',
      icon: <AddReactionIcon fontSize='large' htmlColor='#dc3545' />,
      buttonBackground: '#f9f2f2',
      description:
        'Extend your organization security by adding decision makers.',
      onClickHandler: onAddBoardMember
    },
    {
      title: 'Add Proposer',
      icon: <ThumbUpAltIcon fontSize='large' htmlColor='#16d296' />,
      buttonBackground: '#f3fdfa',
      description:
        'Proposers can suggest and take initiatives whenever is needed without compromising the organization security.',
      onClickHandler: onAddProposers
    },
    {
      title: 'Adjust quorum size',
      icon: <FactCheckIcon fontSize='large' htmlColor='#1390ff' />,
      buttonBackground: '#F3F9FF',
      description:
        'Adjust number of members of a deliberative assembly necessary to conduct the business of that group.',
      onClickHandler: onChangeQuorum
    }
  ];

  const isSmallScreen = useMediaQuery('(max-width:850px)');

  const useStyles: CallableFunction = useMemo(
    () =>
      makeStyles({
        container: {
          'min-height': '60vh',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: isSmallScreen ? '1fr' : '1fr 1fr',
          gridTemplateRows: isSmallScreen ? '' : 'repeat(3, 1fr)',
          gridGap: isSmallScreen ? '1.8rem' : '1.8rem 4rem',
          margin: '40px 0'
        },
        child1: {
          gridRow: isSmallScreen ? '1 / 2' : '1 / 4',
          gridColumn: '1 / 2'
        },
        child2: {
          gridRow: isSmallScreen ? '2 / 3' : '1 / 2',
          gridColumn: isSmallScreen ? '1 / 2' : '2 / 3',

          'border-radius:': '4px'
        },
        child3: {
          gridRow: isSmallScreen ? '3 / 4' : '2 / 3',
          gridColumn: isSmallScreen ? '1 / 2' : '2 / 3',
          boxShadow: '0 0.25rem 0.5rem rgba(108, 108, 108, 0.18) !important',
          backgroundColor: 'red'
        },
        child4: {
          gridRow: isSmallScreen ? '4 / 5 ' : '3 / 4',
          gridColumn: isSmallScreen ? '1 / 2' : '2 / 3',
          boxShadow: '0 0.25rem 0.5rem rgba(108, 108, 108, 0.18) !important',
          backgroundColor: 'red'
        }
      }),
    [isSmallScreen]
  );

  const classes = useStyles();

  return (
    <>
      <Box className={classes.container}>
        <Box className={classes.child1}>
          <div className='shadow w-100 h-100 rounded'>
            <MembersCard />
          </div>
        </Box>
        {membersActionCards.map((item, idx) => (
          <Box key={idx} className={classes[idx]}>
            <MembersActionCard
              buttonBackground={item.buttonBackground}
              icon={item.icon}
              description={item.description}
              title={item.title}
              onClickHandler={item.onClickHandler}
            />
          </Box>
        ))}
      </Box>

      <Grid
        direction='column'
        container
        className='shadow overflow-hidden p-5 rounded '
      >
        <div className='mb-4'>
          <h2>Permission Catalog</h2>
        </div>
        <MembersTable />
      </Grid>
    </>
  );
}

export default OrganizationContent;
