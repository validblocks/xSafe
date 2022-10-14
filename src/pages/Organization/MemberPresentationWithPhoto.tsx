import { Address } from '@elrondnetwork/erdjs/out';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { Box, Typography } from '@mui/material';
import CopyButton from 'src/components/CopyButton';
import { toSvg } from 'jdenticon';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import { network } from 'src/config';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { useSelector } from 'react-redux';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';

type Props = {
  memberAddress: Address;
  charactersLeftAfterTruncation?: number;
};

const MemberPresentationWithPhoto = ({
  memberAddress,
  charactersLeftAfterTruncation = 5,
}: Props) => {
  const addressBook = useSelector(addressBookSelector);
  return (
    <div
      key={memberAddress?.bech32()?.toString()}
      className="d-flex align-items-center w-100"
    >
      {
        <div
          dangerouslySetInnerHTML={{ __html: toSvg(memberAddress?.bech32(), 40) }}
        />
    }
      <Box sx={{ ml: '0.7rem' }}>
        <Typography sx={{ fontWeight: 600 }}>@herotag</Typography>
        <Box sx={{ display: 'flex' }}>
          <div>
            {addressBook[memberAddress?.bech32()] ?? truncateInTheMiddle(
              memberAddress?.bech32() ?? '',
              charactersLeftAfterTruncation,
            )}{' '}
          </div>
          <CopyButton className="ml-2 icon-purple" text={memberAddress?.toString()} />
          <Anchor
            href={`${
              network.explorerAddress
            }/accounts/${memberAddress?.toString()}`}
            target="_blank"
            rel="noreferrer"
            className="ml-2 color-purple"
          >
            <ContentPasteGoIcon />
          </Anchor>
        </Box>
      </Box>
    </div>
  );
};

export default MemberPresentationWithPhoto;
