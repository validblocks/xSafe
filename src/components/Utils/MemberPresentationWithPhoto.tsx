import { Address } from '@multiversx/sdk-core/out';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import CopyButton from 'src/components/Utils/CopyButton';
import { toSvg } from 'jdenticon';
import { AnchorPurple } from 'src/components/Layout/Navbar/navbar-style';
import { network } from 'src/config';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import * as Styled from './styled/index';
import * as Custom from '../../pages/Safe/styled';

type Props = {
  memberAddress: Address;
  charactersLeftAfterTruncation?: number;
};

const MemberPresentationWithPhoto = ({
  memberAddress,
  charactersLeftAfterTruncation = 5,
}: Props) => {
  const theme = useCustomTheme();

  const memberName = truncateInTheMiddle(
    memberAddress?.bech32() ?? '',
    charactersLeftAfterTruncation,
  );

  return (
    <div
      key={memberAddress?.bech32()?.toString()}
      className="d-flex align-items-center w-100"
    >
      {
        <Custom.SvgBox
          dangerouslySetInnerHTML={{
            __html: toSvg(memberAddress?.bech32(), 40),
          }}
        />
      }
      <Box sx={{ ml: '7px' }}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ color: theme.palette.text.primary }}>{memberName}</Box>
          <Box ml={1}>
            <CopyButton
              link={Styled.CopyIconLinkPurple}
              text={memberAddress?.toString()}
            />
          </Box>
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
