import { Box, Grid, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import CircularStatic from 'src/components/ProgressBar/progressCircle';
import LinearWithValueLabel from 'src/components/ProgressBar/progressLinear';

function ProgressBarsSection() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: 'unset',
  }));

  return (
    <Grid container>
      <Grid
        item
        md={6}
        xs={12}
        alignItems="center"
        justifyContent="space-between"
        direction="row"
      >
        <Item
          sx={{ height: '200px', p: 4 }}
          className="d-flex flex-row align-items-center justify-content-between"
        >
          <Box>
            <CircularStatic />
          </Box>
          <Box>
            <Typography align="left" variant="h5">
              Actions needed
            </Typography>
            <Typography align="left" variant="inherit">
              Decisions inside organization are waiting for your vote
            </Typography>
          </Box>
        </Item>
      </Grid>
      <Grid item md={6} xs={12}>
        <Item className="d-flex flex-column" sx={{ height: '200px', p: 4 }}>
          <Box className="d-flex" sx={{ my: 2 }}>
            <Typography className="linear-label">Payments</Typography>
            <LinearWithValueLabel />
          </Box>
          <Box className="d-flex" sx={{ my: 2 }}>
            <Typography className=" linear-label">Organization</Typography>
            <LinearWithValueLabel />
          </Box>
          <Box className="d-flex" sx={{ my: 2 }}>
            <Typography className="linear-label">Tokens</Typography>
            <LinearWithValueLabel />
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
}

export default ProgressBarsSection;
