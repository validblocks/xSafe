import { useState } from 'react';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { tokenTableRowsSelector } from 'src/redux/selectors/accountSelector';
import { selectedTokenToSendSelector } from 'src/redux/selectors/modalsSelector';
import TokenPresentationWithPrice from 'src/components/Utils/TokenPresentationWithPrice';
import * as Styled from 'src/components/MultisigDetails/ProposeMultiselectModal/styled';
import { TokenTableRowItem } from 'src/types/organization';
import { setSelectedTokenToSend } from 'src/redux/slices/modalsSlice';

interface IProps {
  amountError: string | false | undefined;
  resetAmount: any;
}

const TokenSelection = ({ amountError, resetAmount }: IProps) => {
  const dispatch = useDispatch();
  const selectedToken = useSelector(selectedTokenToSendSelector);
  const [identifier, setIdentifier] = useState(
    selectedToken?.identifier || 'EGLD',
  );
  const tokenTableRows = useSelector(tokenTableRowsSelector);

  const onIdentifierChanged = (event: SelectChangeEvent) => {
    const newIdentifier = event.target.value;
    setIdentifier(newIdentifier as string);
    dispatch(
      setSelectedTokenToSend({
        identifier: newIdentifier,
      }),
    );
    resetAmount();
  };

  return (
    <Styled.TokenSelection
      value={identifier ?? 'EGLD'}
      fullWidth
      label="Identifier"
      size="small"
      className={amountError != null ? 'invalid' : ''}
      MenuProps={{
        className:
          identifier === 'EGLD'
            ? 'SendTokenListOpened'
            : 'SendTokenListOpenedWithoutEGLD',
      }}
      onChange={onIdentifierChanged}
    >
      {tokenTableRows?.map((token: TokenTableRowItem) => (
        <MenuItem
          key={token.id}
          value={token.identifier}
          sx={{ width: '230px', pl: '.1rem', pr: '.3rem' }}
        >
          <TokenPresentationWithPrice identifier={token.identifier as string} />
        </MenuItem>
      ))}
    </Styled.TokenSelection>
  );
};

export default TokenSelection;
