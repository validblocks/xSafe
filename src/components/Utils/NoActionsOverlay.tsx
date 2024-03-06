import * as Styled from '../../pages/Transactions/styled';

const NoActionsOverlay = ({ message }: { message: string }) => (
  <Styled.NoActionsOverlayCard>
    <span>{message}</span>
  </Styled.NoActionsOverlayCard>
);

export default NoActionsOverlay;
