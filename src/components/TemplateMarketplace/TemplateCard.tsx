import { Box, Chip, useMediaQuery } from '@mui/material';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import * as Styled from '../../pages/Marketplace/styled';
import { toSvg } from 'jdenticon';
import { network } from 'src/config';
import SearchIcon from '@mui/icons-material/Search';
import { truncateInTheMiddle } from 'src/utils/addressUtils';
import { AnchorPurple } from '../Layout/Navbar/navbar-style';
import CopyButton from '../Utils/CopyButton';
import * as StyledUtils from '../Utils/styled/index';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { MainButton } from '../Theme/StyledComponents';
import { Template } from 'src/types/templates';
import { useCallback, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  setProposeModalSelectedOption,
  setSelectedTemplateForSaving,
} from 'src/redux/slices/modalsSlice';
import { ModalTypes } from 'src/types/multisig/proposals/Proposals';
import { useNavigate } from 'react-router-dom';
import { useAdjustedText } from 'src/hooks/useAdjustedText';

const TemplateCard = (props: Template) => {
  const theme = useCustomTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const minWidth530 = useMediaQuery('(min-width:530px)');
  const minWidth475 = useMediaQuery('(min-width:475px)');
  const { templateName, type, receiver, endpoint, params, value, owner } =
    props;

  const handleSaveButtonClick = useCallback(async () => {
    dispatch(setSelectedTemplateForSaving(props));
    dispatch(
      setProposeModalSelectedOption({ option: ModalTypes.save_template }),
    );
  }, [dispatch, props]);

  const handleUseNowButtonClick = useCallback(async () => {
    dispatch(setSelectedTemplateForSaving(props));
    navigate(`?tab=sc-interactions`);
  }, [dispatch, navigate, props]);

  const prettyReceiver = useMemo(
    () =>
      minWidth530
        ? truncateInTheMiddle(receiver, 11)
        : minWidth475
        ? truncateInTheMiddle(receiver, 5)
        : truncateInTheMiddle(receiver, 5),
    [receiver, minWidth475, minWidth530],
  );

  const ownerContainerRef = useRef<HTMLDivElement>(null);
  const adjustedCreatorAddress = useAdjustedText({
    initialText: owner,
    textToAdjust: owner,
    containerRef: ownerContainerRef,
    dependencies: [owner],
  });

  return (
    <Styled.TemplateCard>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Text variant="h5" fontWeight="700 !important">
              {templateName}
            </Text>
            <Text sx={{ opacity: 0.5 }}>@{endpoint}</Text>
          </Box>
          <Box>
            <Box
              sx={{
                borderRadius: '4px',
                overflow: 'hidden',
                marginRight: '5px',
              }}
              dangerouslySetInnerHTML={{
                __html: toSvg(JSON.stringify(props), 40, { padding: 0 }),
              }}
            />
          </Box>
        </Box>
        <Box
          p={2}
          sx={{
            borderTop: `2px solid ${theme.palette.divider.tabs}`,
            borderBottom: `2px solid ${theme.palette.divider.tabs}`,
          }}
        >
          <Text
            sx={{ opacity: 0.5, mb: 0.5 }}
            fontWeight="400 !important"
            fontSize="15px"
          >
            Receiver
          </Text>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                borderRadius: '4px',
                overflow: 'hidden',
                marginRight: '5px',
              }}
              dangerouslySetInnerHTML={{
                __html: toSvg(receiver, 20, { padding: 0 }),
              }}
            />
            <Text
              variant="inherit"
              className="mb-0"
              fontWeight="700 !important"
            >
              {prettyReceiver}
            </Text>
            <Box display="flex" alignItems="center">
              <Box sx={{ ml: 1 }}>
                <CopyButton
                  link={StyledUtils.CopyIconLinkPurple}
                  text={receiver}
                />
              </Box>
              <Box sx={{ ml: 0.5 }}>
                <AnchorPurple
                  href={`${network.explorerAddress}/accounts/${receiver}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2"
                >
                  <SearchIcon />
                </AnchorPurple>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          sx={{
            borderBottom: `2px solid ${theme.palette.divider.tabs}`,
          }}
        >
          <Box flex="1" p={2}>
            <Text
              fontSize="15px"
              sx={{ opacity: 0.5 }}
              fontWeight="400 !important"
            >
              Value
            </Text>
            <Text variant="subtitle1" fontWeight="700 !important">
              {Number(value).toLocaleString('EN')} EGLD
            </Text>
          </Box>
          <Box
            flex="1"
            p={2}
            sx={{
              borderLeft: `2px solid ${theme.palette.divider.tabs}`,
            }}
          >
            <Text
              fontSize="15px"
              sx={{ opacity: 0.5 }}
              fontWeight="400 !important"
            >
              Type
            </Text>
            <Text variant="subtitle1" fontWeight="700 !important">
              {type}
            </Text>
          </Box>
        </Box>
        <Box
          p={2}
          sx={{
            borderBottom: `2px solid ${theme.palette.divider.tabs}`,
          }}
        >
          <Text
            sx={{ opacity: 0.5, mb: 0.5 }}
            fontWeight="400 !important"
            fontSize="15px"
          >
            Creator
          </Text>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                borderRadius: '4px',
                marginRight: '.5rem',
              }}
              dangerouslySetInnerHTML={{
                __html: toSvg(receiver, 20, { padding: 0 }),
              }}
            />
            <Box
              ref={ownerContainerRef}
              width="100%"
              display="flex"
              alignItems="center"
            >
              <Text
                variant="inherit"
                className="mb-0"
                fontWeight="700 !important"
              >
                {adjustedCreatorAddress}
              </Text>
              <Box display="flex" alignItems="center">
                <Box sx={{ ml: 1 }}>
                  <CopyButton
                    link={StyledUtils.CopyIconLinkPurple}
                    text={receiver}
                  />
                </Box>
                <Box sx={{ ml: 0.5 }}>
                  <AnchorPurple
                    href={`${network.explorerAddress}/accounts/${receiver}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2"
                  >
                    <SearchIcon />
                  </AnchorPurple>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box p={2}>
          <Text
            fontSize="15px"
            sx={{ opacity: 0.5 }}
            fontWeight="400 !important"
            mb={1}
          >
            Arguments
          </Text>
          <Box mb={0.25}>
            {params?.map((param, idx) => (
              <Chip
                key={idx}
                sx={{
                  color: theme.palette.text.primary,
                  borderColor: '#4c2ffc',
                  mb: 0.5,
                  mr: 0.5,
                }}
                variant="outlined"
                label={param}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        sx={{
          borderTop: `2px solid ${theme.palette.divider.tabs}`,
        }}
      >
        <Box flex="1" p={2}>
          <MainButton
            fullWidth
            onClick={handleSaveButtonClick}
            sx={{
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
            }}
          >
            Save
          </MainButton>
        </Box>
        <Box
          flex="1"
          p={2}
          sx={{
            borderLeft: `2px solid ${theme.palette.divider.tabs}`,
          }}
        >
          <MainButton fullWidth onClick={handleUseNowButtonClick}>
            Use now
          </MainButton>
        </Box>
      </Box>
    </Styled.TemplateCard>
  );
};

export default TemplateCard;
