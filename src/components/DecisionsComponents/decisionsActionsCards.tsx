import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LanIcon from '@mui/icons-material/Lan';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LinearWithValueLabel from 'components/ProgressBar/progressLinear';
import { TypographyBold } from 'components/Theme/StyledComponents';

const DecisionsActionsCards = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: 'unset',
  }));

  const actionCardsArray = [
    {
      title: 'Add board member to organization',
      date: '27/06/2022',
      icon: <LanIcon />,
      id: '#6',
      url: 'https://raw.example.com...',
      progress: <LinearWithValueLabel />,
      type: 'Organization',
      link: 'add-board-member-to-organization',
      class: 'organization-btn',
    },
    {
      title: 'Make new payment',
      date: '27/06/2022',
      icon: <LocalAtmIcon />,
      id: '#4',
      url: 'https://raw.example.com...',
      progress: <LinearWithValueLabel />,
      type: 'Tokens',
      link: 'make-new-payment',
      class: 'payments-btn',
    },
    {
      title: 'Create new token',
      date: '27/06/2022',
      icon: <InsertDriveFileIcon />,
      id: '#3',
      url: 'https://raw.example.com...',
      progress: <LinearWithValueLabel />,
      type: 'Payments',
      link: 'create-new-token',
      class: 'tokens-btn',
    },
  ];
  return (
    <Grid container spacing={2}>
      {actionCardsArray.map((item) => (
        <Grid key={item.id} item md={4} xs={12} className="action-cards">
          <Link to={item.link}>
            <Item sx={{ p: 5 }}>
              <Box className="d-flex justify-content-between">
                <Button disabled className={item.class}>
                  {item.icon}
                  {item.type}
                </Button>
                <Typography align="right" className="box-number">
                  {item.id}
                </Typography>
              </Box>
              <Box sx={{ my: 4 }}>
                <TypographyBold align="left" variant="h6">
                  {item.title}
                </TypographyBold>
                <Typography align="left" variant="inherit">
                  Due:
                  {item.date}
                </Typography>
              </Box>
              <Typography align="left" variant="inherit">
                Link:
                {item.url}
              </Typography>
              <Box sx={{ my: 4 }}>
                <Box className="d-flex justify-content-between">
                  <Typography align="left" variant="inherit">
                    Progress
                  </Typography>
                  <TypographyBold align="left" variant="inherit">
                    Approved
                  </TypographyBold>
                </Box>
                <LinearWithValueLabel />
              </Box>
            </Item>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default DecisionsActionsCards;
