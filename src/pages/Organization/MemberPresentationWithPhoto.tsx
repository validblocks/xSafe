import { Address } from '@multiversx/sdk-core/out';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import CopyButton from 'src/components/CopyButton';
import { toSvg } from 'jdenticon';
import { AnchorPurple } from 'src/components/Layout/Navbar/navbar-style';
import { network } from 'src/config';
import { useCustomTheme } from 'src/utils/useCustomTheme';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { useSelector } from 'react-redux';
import { addressBookSelector } from 'src/redux/selectors/addressBookSelector';
import * as Styled from '../../components/Utils/styled/index';
import * as Cutomed from './styled';

type Props = {
  memberAddress: Address;
  charactersLeftAfterTruncation?: number;
};

const MemberPresentationWithPhoto = ({
  memberAddress,
  charactersLeftAfterTruncation = 5,
}: Props) => {
  const theme = useCustomTheme();
  const addressBook = useSelector(addressBookSelector);
  return (
    <div
      key={memberAddress?.bech32()?.toString()}
      className="d-flex align-items-center w-100"
    >
      {
        <Cutomed.SvgBox
          dangerouslySetInnerHTML={{ __html: toSvg(memberAddress?.bech32(), 40) }}
        />
    }
      <Box sx={{ ml: '7px' }}>
        {/* <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>@herotag</Typography> */}
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ color: theme.palette.text.primary }}>
            {addressBook[memberAddress?.bech32()] ?? truncateInTheMiddle(
              memberAddress?.bech32() ?? '',
              charactersLeftAfterTruncation,
            )}{' '}
          </Box>
          <CopyButton className="ml-2" link={Styled.CopyIconLinkPurple} text={memberAddress?.toString()} />
          <AnchorPurple
            href={`${
              network.explorerAddress
            }/accounts/${memberAddress?.toString()}`}
            target="_blank"
            rel="noreferrer"
            className="ml-2"
          >
            <SearchIcon />
          </AnchorPurple>
        </Box>
      </Box>
    </div>
  );
};

export default MemberPresentationWithPhoto;
