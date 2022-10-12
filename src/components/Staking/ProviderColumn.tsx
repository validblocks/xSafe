import { Link } from '@mui/material';
import { Box } from '@mui/system';
import { IProviderColumn } from 'src/types/staking';
import { useTheme } from 'styled-components';
import { Text } from '../StyledComponents/StyledComponents';

interface Props {
    columnData?: IProviderColumn;
    withAPR?: boolean;
}

const ProviderColumn = ({
  columnData: { avatar, name, website, apr } = { avatar: '', name: '', website: '', apr: 0 },
  withAPR = false,
}: Props) => {
  const theme: any = useTheme();
  if (name.length > 20) {
    name = `${name.substring(0, 20)}...`;
  }

  return (
    <Box sx={{ display: 'flex', gap: '12px', height: '68px', alignItems: 'center' }}>
      <Box
        width={48}
        height={48}
        sx={{ backgroundImage: `url(${avatar})`, backgroundSize: 'cover' }}
        borderRadius="10px"
      />
      <Box>
        <Text
          sx={{ letterSpacing: '-0.01em' }}
          fontWeight={500}
          fontSize={17}
          noWrap
        >
          {name}
        </Text>
        {withAPR ? <Text>{apr}%</Text> : (
          <Link
            underline="none"
            color="grey"
            fontWeight={400}
            fontSize={12}
            href={website}
            sx={{ color: `${theme.palette.text.primary} !important`, opacity: 0.5 }}
            target="_blank"
            rel="noreferrer"
          >{website}
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default ProviderColumn;
