import styled from 'styled-components';

export const Span = styled.span`
  font-weight: ${(props) => {
    return props.theme.palette.typography.bold;
  }};
`;
