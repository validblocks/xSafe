import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Grid } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp
} from '@mui/x-data-grid';
import MembersActionCard from './MembersActionCard';
import MembersCard from './MembersCard';

type ActionType = {
  icon: any;
  text: string;
  callback: CallableFunction;
};

const OrganizationContent = () => {
  const actions: ActionType[] = [
    {
      icon: '',
      text: 'Edit',
      callback: () => {
        console.log('Edit called');
      }
    }
  ];
  const rows: GridRowsProp = [
    { id: 1, member: 'Hello', role: 'World' },
    { id: 2, member: 'DataGridPro', role: 'is Awesome' },
    { id: 3, member: 'MUI', role: 'is Amazing' }
  ];

  const columns: GridColDef[] = [
    { field: 'member', headerName: 'Member', width: 150 },
    { field: 'role', headerName: 'Role', width: 150 },
    {
      field: 'actions',
      flex: 1,
      type: 'actions',
      headerName: 'Quick Actions',
      sortable: false,
      getActions: (params: any) =>
        actions.map((action) => (
          <Button onClick={() => action.callback(params.row)} key={action.text}>
            <img src={action.icon} alt={action.text} />
          </Button>
        ))
    }
  ];

  return (
    <>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='stretch'
        spacing={3}
        className='content__container'
      >
        <Grid item xs={12} md={6}>
          <MembersCard />
        </Grid>
        <Grid item xs={12} md={6} className=''>
          <Grid container direction='column' justifyContent='center'>
            <Grid item>
              <MembersActionCard />
            </Grid>
            <Grid item>
              <MembersActionCard />
            </Grid>
            <Grid item>
              <MembersActionCard />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <DataGrid rows={rows} columns={columns} /> */}
    </>
  );
};

export default OrganizationContent;
