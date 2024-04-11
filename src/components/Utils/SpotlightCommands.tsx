import { InputAdornment, Modal, OutlinedInput } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useNavigate } from 'react-router-dom';
import routeNames from 'src/routes/routeNames';
import {
  setProposeModalSelectedOption,
  setProposeMultiselectSelectedOption,
} from 'src/redux/slices/modalsSlice';
import {
  ModalTypes,
  ProposalsTypes,
} from 'src/types/multisig/proposals/Proposals';
import { CenteredBox } from '../StyledComponents/StyledComponents';
import { useLogoutLogic } from 'src/hooks/useLogoutLogic';

export const SpotlightCommands = () => {
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const currentContract = useSelector(currentMultisigContractSelector);
  const { address } = useGetAccountInfo();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === ' ') {
        if (isMounted) {
          setIsCommandOpen((isCommandModalOpen) => {
            if (!isCommandModalOpen) {
              const div = document.querySelector("div[role='dialog']");
              div?.removeAttribute('tabindex');
            }
            return !isCommandModalOpen;
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      isMounted = false;
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  const navigate = useNavigate();
  const { logoutWithCleanup } = useLogoutLogic();

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsCommandOpen(false);
      }
      if (event.key === 'Enter') {
        const command = event.currentTarget.value;
        switch (command) {
          case 'login':
            dispatch(
              setProposeModalSelectedOption({
                option: ModalTypes.connect_wallet,
              }),
            );
            break;
          case 'ad':
            dispatch(
              setProposeModalSelectedOption({
                option: ModalTypes.connect_wallet,
              }),
            );
            break;
          case 'logout':
            logoutWithCleanup?.();
            break;
          case 'csa':
            handleCopy(currentContract?.address);
            break;
          case 'cwa':
            handleCopy(address);
            break;
          case 'nd':
            navigate(routeNames.dashboard);
            break;
          case 'nto':
            navigate(routeNames.tokens);
            break;
          case 'ntr':
            navigate(routeNames.transactions);
            break;
          case 'nn':
            navigate(routeNames.nft);
            break;
          case 'no':
            navigate(routeNames.members);
            break;
          case 'nc':
            navigate(routeNames.cvorum);
            break;
          case 'ns':
            navigate(routeNames.settings);
            break;
          case 'cm': {
            dispatch(setProposeMultiselectSelectedOption(null));
            dispatch(setProposeModalSelectedOption(null));
            break;
          }
          case 'st':
          case 'sendToken':
          case 'send token': {
            dispatch(
              setProposeMultiselectSelectedOption({
                option: ProposalsTypes.send_token,
              }),
            );
            break;
          }
          case 'add board member':
          case 'addBoardMember':
          case 'abm': {
            dispatch(
              setProposeModalSelectedOption({
                option: ProposalsTypes.add_board_member,
              }),
            );
            break;
          }
          default:
            break;
        }
        setIsCommandOpen(false);
      }
    },
    [
      address,
      currentContract?.address,
      dispatch,
      handleCopy,
      logoutWithCleanup,
      navigate,
    ],
  );

  const theme = useCustomTheme();

  return (
    <Modal open={isCommandOpen}>
      <CenteredBox height="100%" px={'20%'}>
        <OutlinedInput
          tabIndex={1}
          placeholder="Quick command"
          fullWidth
          inputRef={(input) => input?.focus()}
          sx={{
            background: theme.palette.background.secondary,
            color: theme.palette.text.primary,
            maxWidth: '600px !important',
            '& .MuiOutlinedInput-notchedOutline': {
              boxShadow: `0px 0px 48px ${theme.shadows.main} !important`,
              border: '1px solid #4C2FFC !important',
            },
          }}
          startAdornment={
            <InputAdornment position="start">
              <TipsAndUpdatesRoundedIcon
                sx={{
                  background: theme.palette.background.secondary,
                  color: theme.palette.text.primary,
                  '& .MuiOutlinedInput-notchedOutline': {
                    boxShadow: `0px 0px 8px ${theme.shadows.main} !important`,
                  },
                }}
              />
            </InputAdornment>
          }
          onKeyDown={onKeyDown}
        />
      </CenteredBox>
    </Modal>
  );
};
