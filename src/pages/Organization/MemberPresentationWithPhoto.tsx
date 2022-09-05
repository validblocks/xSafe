import { Address } from '@elrondnetwork/erdjs/out';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { Box, Typography } from '@mui/material';
import CopyButton from 'src/components/CopyButton';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import { network } from 'src/config';
import { truncateInTheMiddle } from 'src/utils/addressUtils';

type Props = {
  memberAddress: Address;
  charactersLeftAfterTruncation?: number;
};

const MemberPresentationWithPhoto = ({
  memberAddress,
  charactersLeftAfterTruncation = 5,
}: Props) => (
  <div
    key={memberAddress?.bech32()?.toString()}
    className="d-flex align-items-center w-100"
  >
    <img
      className="rounded"
      src="https://picsum.photos/40/40?random=1"
      alt="member"
    />
    <Box sx={{ ml: '0.7rem' }}>
      <Typography sx={{ fontWeight: 600 }}>@herotag</Typography>
      <Box sx={{ display: 'flex' }}>
        <div>
          {truncateInTheMiddle(
            memberAddress?.bech32() ?? '',
            charactersLeftAfterTruncation,
          )}{' '}
        </div>
        <CopyButton className="ml-2 copyIcon" text={memberAddress?.toString()} />
        <Anchor
          href={`${
            network.explorerAddress
          }/accounts/${memberAddress?.toString()}`}
          target="_blank"
          rel="noreferrer"
          color="#4c2ffc8a"
          className="ml-2"
        >
          <ContentPasteGoIcon />
        </Anchor>
      </Box>
    </Box>
  </div>
);

export default MemberPresentationWithPhoto;
