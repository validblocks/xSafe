/* eslint-disable no-nested-ternary */
import { Typography, useMediaQuery } from '@mui/material';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import * as Styled from '../styled/index';

const MobileCardsForTableReplacement = ({ items, action }: { items: any, action?: JSX.Element[] }) => {
  const minWidth475 = useMediaQuery('(min-width:475px)');
  const minWidth530 = useMediaQuery('(min-width:530px)');

  return (
    items.map((item: any) => (
      <Styled.MobileCardOfMembers key={item.address}>
        <Styled.CategoryName>
          <Typography component="span">Name</Typography>
          <Typography fontWeight="600 !important" component="h6">{item.name}</Typography>
        </Styled.CategoryName>
        <Styled.CategoryName>
          <Typography component="span">Address</Typography>
          <Typography component="h6" className="mb-0 font-weight-normal">
            {minWidth530 ? truncateInTheMiddle(item.address, 14) :
              minWidth475 ? truncateInTheMiddle(item.address, 11) :
                truncateInTheMiddle(item.address, 8)}
          </Typography>
        </Styled.CategoryName>
        <Styled.CategoryName>
          <Typography
            component="span"
            textAlign="left"
            marginBottom="5px !important"
            paddingLeft={'4px'}
          >Actions
          </Typography>
          <Styled.ActionButtonsBoxMembers>{action}</Styled.ActionButtonsBoxMembers>
        </Styled.CategoryName>
      </Styled.MobileCardOfMembers>
    ))
  );
};

export default MobileCardsForTableReplacement;
