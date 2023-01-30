import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import BoltIcon from '@mui/icons-material/Bolt';
import { Box, useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';
import { AccountButton } from 'src/components/Theme/StyledComponents';
import addressShorthand from 'src/helpers/addressShorthand';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'src/utils/usePrevious';
import { ModalTypes } from 'src/types/Proposals';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { proposeModalSelectedOptionSelector } from 'src/redux/selectors/modalsSelector';

function Account() {
  const { address } = useGetAccountInfo();
  const { isLoggedIn, loginMethod } = useGetLoginInfo();
  const accountButtonRef = useRef<HTMLButtonElement | null>(null);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    setWalletAddress(addressShorthand(address));
  }, [isLoggedIn, address]);

  const [isMainButtonActive, setIsMainButtonActive] = useState(false);
  const dispatch = useDispatch();
  const wasLoggedIn = usePrevious(isLoggedIn, false);

  const minWidth600 = useMediaQuery('(min-width:600px)');

  const handleClick = () => {
    setIsMainButtonActive(true);
    dispatch(
      setProposeModalSelectedOption({
        option: ModalTypes.connect_wallet,
      }),
    );
  };

  const handleClose = useCallback(() => {
    setIsMainButtonActive(false);
  }, []);

  useEffect(() => {
    if (!wasLoggedIn && loginMethod) {
      handleClose();
    }
  }, [handleClose, loginMethod, wasLoggedIn]);

  const MAIN_BUTTON_VARIABLE_STYLE = useMemo(
    () => ({
      backgroundColor: isMainButtonActive ? '#4C2FFC !important' : '',
      color: isMainButtonActive ? '#FFFF !important' : '',
    }), [isMainButtonActive],
  );

  const selectedOption = useSelector(proposeModalSelectedOptionSelector);

  useEffect(() => {
    setIsMainButtonActive(selectedOption === ModalTypes.connect_wallet);
  }, [selectedOption]);

  return (
    <Box display="flex" gap={2} mr={minWidth600 ? 2 : 0}>
      <AccountButton
        variant="outlined"
        onClick={handleClick}
        onKeyDown={(e) => e.preventDefault()}
        onKeyUp={(e) => e.preventDefault()}
        size="large"
        ref={accountButtonRef}
        className={isMainButtonActive ? 'isActive' : ''}
        sx={{ ...MAIN_BUTTON_VARIABLE_STYLE }}
      >
        <Box className="d-flex">
          <BoltIcon />
          {minWidth600 && (
            <Typography sx={{ textTransform: isLoggedIn ? 'lowercase' : 'none' }}>
              {isLoggedIn ? walletAddress : 'Connect'}
            </Typography>
          )}
        </Box>
      </AccountButton>
    </Box>
  );
}

export default Account;
