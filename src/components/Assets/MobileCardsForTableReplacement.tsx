import { ReactComponent as ElrondLogo } from 'src/assets/img/logo.svg';
import { ReactComponent as ElrondLogoWhite } from 'src/assets/img/elrond-logo-white.svg';
import { operations } from '@elrondnetwork/dapp-utils';
import { Balance } from '@elrondnetwork/erdjs/out';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import * as Styled from '../../pages/Organization/styled';

export const SQUARE_IMAGE_WIDTH = 30;
export const SQUARE_SMALL_IMAGE_WIDTH = 20;

const MobileCardsForTableReplacement = ({ items, actionButton }:
    { items: any, actionButton: JSX.Element[] }) => {
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  return (
    items.map((item: any) => (
      <Styled.MobileCardOfTokens key={item.id}>
        <Styled.TokenDetailsBox>
          <Styled.CategoryName>
            <Typography component="span">Assets</Typography>
            <li>
              {item.balanceDetails.identifier !== 'EGLD' && (
                <img
                  width={SQUARE_SMALL_IMAGE_WIDTH}
                  height={SQUARE_SMALL_IMAGE_WIDTH}
                  src={item.presentation.photoUrl}
                  alt={item.presentation.tokenIdentifier}
                />
              )}
              {item.balanceDetails.identifier === 'EGLD' && (
                isDarkThemeEnabled ? (
                  <ElrondLogoWhite
                    width={SQUARE_SMALL_IMAGE_WIDTH}
                    height={SQUARE_SMALL_IMAGE_WIDTH}
                  />
                )
                  : (
                    <ElrondLogo
                      width={SQUARE_SMALL_IMAGE_WIDTH}
                      height={SQUARE_SMALL_IMAGE_WIDTH}
                    />
                  )
              )}
              <strong>{item.balanceDetails.identifier}</strong>
            </li>
          </Styled.CategoryName>
          <Styled.CategoryName>
            <Typography component="span">Balance</Typography>
            <Typography component="h6" className="mb-0 font-weight-normal">
              {Number(operations.denominate({
                input: Balance.fromString(item.balanceDetails.amount).toString(),
                denomination: item.decimals,
                decimals: 3,
                showLastNonZeroDecimal: true,
              }).replaceAll(',', '')).toLocaleString()
                        } ${item.balanceDetails.identifier}
            </Typography>
          </Styled.CategoryName>
          <Styled.CategoryName>
            <Typography component="span">Value</Typography>
            <Typography component="h6" className="mb-0 font-weight-normal">value USD</Typography>
          </Styled.CategoryName>
        </Styled.TokenDetailsBox>
        <Styled.ActionButtonsBox>{actionButton}</Styled.ActionButtonsBox>
      </Styled.MobileCardOfTokens>
    ))
  );
};

export default MobileCardsForTableReplacement;
