import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import {
  Typography, Grid, Paper, Button, Box,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import LinearWithValueLabel from 'src/components/ProgressBar/progressLinear';
import { TypographyBold } from 'src/components/Theme/StyledComponents';
import DecisionApproved from './decisionApproved';
import TimelineCard from './timeline';

function ActionBoxDetails() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const [showConfirm, setShowConfirm] = useState(false);
  const [showApproved, setShowApproved] = useState(true);

  const showOptions = () => {
    setShowConfirm(true);
    setShowApproved(false);
  };

  const rejectDecision = () => {
    setShowConfirm(false);
    setShowApproved(true);
  };

  const confirmDecision = () => {
    setShowApproved(true);
    setShowConfirm(true);
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={8} xs={12}>
        <Item sx={{ p: 4 }}>
          <Box className="d-flex justify-content-between align-items-center">
            <Typography>Add board member to organization</Typography>
            <Button disabled sx={{ backgroundColor: '#f3fdfa' }}>
              Active
            </Button>
          </Box>
          <Box
            className="d-flex justify-content-between align-items-center"
            sx={{ mt: 3 }}
          >
            <Typography>Proposed by: erd126...aud6uv</Typography>
            <Typography>Due: 27.06.2021</Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography align="left">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry standard dummy text
              ever since the 1500s.
            </Typography>
          </Box>
          <Divider sx={{ mt: 3 }} />
          <Box sx={{ textAlign: 'left', mt: 3 }}>
            <Typography>Approved by:</Typography>
            <Box
              component="img"
              sx={{
                mt: 3,
                height: 80,
                width: 80,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="Image."
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
            />
          </Box>
          <Divider sx={{ mt: 3 }} />
          <TimelineCard />
        </Item>
      </Grid>
      <Grid item md={4} xs={12}>
        <Item sx={{ p: 4 }}>
          <Box>
            <Typography align="left">Take Decisions</Typography>
          </Box>
          <Box className="d-flex justify-content-between mt-4">
            <Typography align="left" variant="inherit">
              Progress
            </Typography>
            <TypographyBold align="left" variant="inherit">
              Approved
            </TypographyBold>
          </Box>
          <LinearWithValueLabel />
          <Box className="d-flex justify-content-between mt-4">
            <Typography align="left" variant="inherit">
              Support
            </Typography>
            <TypographyBold align="left" variant="inherit">
              56% (50% needed)
            </TypographyBold>
          </Box>
          {!showConfirm && showApproved && (
            <Button
              variant="outlined"
              sx={{ mt: 3, width: '100%' }}
              onClick={() => {
                showOptions();
              }}
            >
              <ThumbUpOutlinedIcon />
              <Typography sx={{ pl: 1 }}>Approve</Typography>
            </Button>
          )}
          {showConfirm && !showApproved && (
            <Box>
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Button
                  variant="outlined"
                  sx={{ mr: 2 }}
                  onClick={() => {
                    confirmDecision();
                  }}
                >
                  <DoneIcon />
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    rejectDecision();
                  }}
                >
                  <CloseIcon />
                  Remove
                </Button>
              </Box>
            </Box>
          )}
          {showConfirm && showApproved && <DecisionApproved />}
        </Item>
      </Grid>
    </Grid>
  );
}

export default ActionBoxDetails;
