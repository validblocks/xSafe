import { Box, Typography } from '@mui/material';
import { uniqueId } from 'lodash';
import AssetActionIcon from 'src/assets/img/arrow-back-sharp.svg';
import MultiversXLogoSymbol from 'src/assets/img/multiversx-symbol.svg';
import DisplayTokenPrice from 'src/components/Utils/DisplayTokenPrice';
import { TokenTableRowItem } from 'src/types/organization';
import { ProposalsTypes } from 'src/types/multisig/proposals/Proposals';
import * as Styled from '../../pages/Organization/styled';
import { Text } from '../StyledComponents/StyledComponents';
import { AssetActionButton } from '../Theme/StyledComponents';
import { SQUARE_SMALL_IMAGE_WIDTH } from './MobileCardsForTableReplacement';
import { Converters } from 'src/utils/Converters';

interface IProps {
  tokenRow: TokenTableRowItem;
  handleQrModal: () => void;
  handleOptionSelected: (
    option: ProposalsTypes,
    token: TokenTableRowItem,
  ) => void;
}

const getTokenValue = (tokenRow: TokenTableRowItem) =>
  Converters.denominateWithNDecimals(
    tokenRow?.balanceDetails?.amount ?? '',
    tokenRow.identifier === 'EGLD'
      ? 18
      : tokenRow?.balanceDetails?.decimals ?? 18,
  );

const MobileTokenCard = ({
  tokenRow,
  handleQrModal,
  handleOptionSelected,
}: IProps) => (
  <Styled.MobileCardOfTokens key={uniqueId()}>
    <Styled.TokenDetailsBox>
      <Styled.CategoryName>
        <Typography component="span">Assets</Typography>
        <Box display="flex" gap={1}>
          {tokenRow.balanceDetails?.identifier !== 'EGLD' && (
            <img
              width={SQUARE_SMALL_IMAGE_WIDTH}
              height={SQUARE_SMALL_IMAGE_WIDTH}
              src={tokenRow.presentation?.photoUrl}
              alt={tokenRow.presentation?.tokenIdentifier}
            />
          )}
          {tokenRow.balanceDetails?.identifier === 'EGLD' && (
            <img
              src={MultiversXLogoSymbol}
              width={SQUARE_SMALL_IMAGE_WIDTH}
              height={SQUARE_SMALL_IMAGE_WIDTH}
            />
          )}
          <Text fontWeight={700}>{tokenRow.balanceDetails?.identifier}</Text>
        </Box>
      </Styled.CategoryName>
      <Styled.CategoryName>
        <Typography component="span">Balance</Typography>
        <Typography component="h6" className="mb-0 font-weight-normal">
          {Number(getTokenValue(tokenRow)).toLocaleString('EN')} $
          {tokenRow.balanceDetails?.identifier}
        </Typography>
      </Styled.CategoryName>
      <Styled.CategoryName>
        <Typography component="span">Value</Typography>
        <Typography component="h6" className="mb-0 font-weight-normal">
          <DisplayTokenPrice
            balanceDetails={
              tokenRow.value ?? {
                amount: '0',
                decimals: 0,
                tokenPrice: 0,
                photoUrl: '',
                identifier: '',
              }
            }
            tokenIdentifier={tokenRow.id?.toString() ?? ''}
          />
        </Typography>
      </Styled.CategoryName>
    </Styled.TokenDetailsBox>
    <Styled.ActionButtonsBox>
      <AssetActionButton
        key="0"
        variant="outlined"
        className="shadow-sm rounded"
        onClick={() =>
          handleOptionSelected(ProposalsTypes.send_token, tokenRow)
        }
      >
        <img src={AssetActionIcon} width="30px" height="30px" />
        Send
      </AssetActionButton>
      <AssetActionButton key="1" onClick={handleQrModal}>
        <Box component="span" sx={{ transform: 'rotate(180deg)' }}>
          <img src={AssetActionIcon} width="30px" height="30px" />
        </Box>
        Receive
      </AssetActionButton>
    </Styled.ActionButtonsBox>
  </Styled.MobileCardOfTokens>
);

export default MobileTokenCard;
