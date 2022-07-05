import { useEffect, useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Grid } from '@mui/material';
import { queryBoardMemberAddresses } from 'src/contracts/MultisigContract';

const TimelineCard = () => {
  const [addresses, setAddresses]: any = useState([]);

  useEffect(() => {
    queryBoardMemberAddresses().then((response) => {
      setAddresses(response);
    });
  }, []);

  return (
    <Grid className="timeline-wrapper">
      <Timeline className="align-items-start mt-3">
        {addresses.map((el: any) => (
          <TimelineItem key={el.valueHex}>
            <TimelineSeparator>
              <TimelineDot variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              Board member
              <a href={`https://explorer.elrond.com/search/${el.valueHex}`}>
                {el.valueHex}
              </a>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Grid>
  );
};

export default TimelineCard;
