import { Address } from '@elrondnetwork/erdjs/out';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { Box, Typography } from '@mui/material';
import CopyButton from 'src/components/CopyButton';
import { toSvg } from 'jdenticon';
import { Anchor } from 'src/components/Layout/Navbar/navbar-style';
import { network } from 'src/config';
import { useTheme } from 'styled-components';
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
  const theme: any = useTheme();
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
        <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>@herotag</Typography>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ color: theme.palette.text.primary }}>
            {addressBook[memberAddress?.bech32()] ?? truncateInTheMiddle(
              memberAddress?.bech32() ?? '',
              charactersLeftAfterTruncation,
            )}{' '}
          </Box>
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
};

export default MemberPresentationWithPhoto;
