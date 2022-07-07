import React from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { Box } from '@mui/material';
import CopyButton from 'components/CopyButton';
import { Anchor } from 'components/Layout/Navbar/navbar-style';
import { network } from 'config';
import { truncateInTheMiddle } from 'utils/addressUtils';

type Props = {
  memberAddress: Address;
  charactersLeftAfterTruncation?: number;
};

const MemberPresentationWithPhoto = ({
  memberAddress,
  charactersLeftAfterTruncation = 5
}: Props) => {
  return (
    <div
      key={memberAddress.bech32().toString()}
      className='d-flex align-items-center'
    >
      <img
        className='mr-3 rounded'
        src='https://picsum.photos/30/30?random=1'
      />
      <Box>
        <div>@herotag</div>
        <Box sx={{ display: 'flex' }}>
          <div>
            {truncateInTheMiddle(
              memberAddress.bech32(),
              charactersLeftAfterTruncation
            )}{' '}
          </div>
          <CopyButton className='ml-2' text={memberAddress.toString()} />
          <Anchor
            href={`${
              network.explorerAddress
            }/accounts/${memberAddress.toString()}`}
            target='_blank'
            rel='noreferrer'
            color='#6c757d'
            className='ml-2'
          >
            <ContentPasteSearchIcon />
          </Anchor>
        </Box>
      </Box>
    </div>
  );
};

export default MemberPresentationWithPhoto;
