import { Text } from 'src/components/StyledComponents/StyledComponents';
import { MainButton } from 'src/components/Theme/StyledComponents';
import styled from 'styled-components';

export const TxBuilderTitle = styled(({ sx, className, ...other }) => (
  <Text className={className} sx={sx} {...other} />
))`
  &&& {
    font-weight: bold !important;
    font-size: 1.5rem;
  }
`;

export const TxBuilderHeaderButton = styled(MainButton)(({ theme: _ }) => ({
  flex: 1,
  maxWidth: '150px',
  mt: '5px',
  background: 'transparent !important',
  boxShadow: 'none !important',
}));
