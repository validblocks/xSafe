import { useState } from 'react';
import ContentPasteGoOutlinedIcon from '@mui/icons-material/ContentPasteGoOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import {
  Box, Typography, Grid,
} from '@mui/material';
import { useSelector } from 'react-redux';
import Safe from 'src/assets/img/safe.png';
import CopyButton from 'src/components/CopyButton';
import ReceiveModal from 'src/components/ReceiveModal';
import SafeOptions from 'src/components/SafeOptions';
import { uniqueContractAddress } from 'src/multisigConfig';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { network } from 'src/config';
import {
  Anchor, MembersBox, ReadOnly,
} from '../navbar-style';
import TotalBalance from '../TotalBalance';

const NavbarAccountDetails = ({ uniqueAddress }: { uniqueAddress: string }) => {
  const currentContract = useSelector(currentMultisigContractSelector);
  const [showQr, setShowQr] = useState(false);

  const {
    membersCountState: [membersCount],
  } = useOrganizationInfoContext();

  const [openedSafeSelect, setOpenedSafeSelect] = useState(false);

  const handleQrModal = () => {
    setShowQr(!showQr);
  };

  return (
    <Box>
      <Grid
        container
        spacing={1}
        sx={{ mt: 1 }}
        justifyContent="center"
        alignItems="center"
        padding="0px"
        textAlign="center"
      >
        <Grid item position="relative" sm={3}>
          <Box display="table">
            <img src={Safe} alt="safe" width="60px" height="60px" />
          </Box>
          <Box position="absolute" top="-1.4rem" left="-.5rem">
            <MembersBox>
              <Typography>{membersCount}</Typography>
            </MembersBox>
          </Box>
        </Grid>
        <Grid sx={{ pl: 0 }}>
          <Box
            sx={{ ml: 0.5 }}
            className="d-flex justify-content-center align-items-center"
          >
            <Typography align="center" lineHeight="1">
              {uniqueAddress}
            </Typography>
            {openedSafeSelect === true && (
              <Box
                sx={{
                  '& .css-i4bv87-MuiSvgIcon-root': {
                    color: 'rgba(76, 47, 252, 0.54) !important',
                  },
                }}
              >
                <ArrowDropUpIcon
                  onClick={() => {
                    setOpenedSafeSelect(false);
                  }}
                />
                <SafeOptions />
              </Box>
            )}
            {openedSafeSelect === false && (
              <Box
                sx={{
                  '& .css-i4bv87-MuiSvgIcon-root': {
                    color: 'rgba(76, 47, 252, 0.54) !important',
                  },
                }}
              >
                <ArrowDropDownIcon
                  onClick={() => {
                    setOpenedSafeSelect(true);
                  }}
                />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              mb: 0.7,
            }}
          >
            <Box
              onClick={handleQrModal}
              sx={{
                mr: 1.7,
                ml: 0.2,
                cursor: 'pointer',
              }}
            >
              <QrCode2Icon />
            </Box>
            <Box sx={{ mr: 1.85, ml: 0.35 }}>
              <CopyButton text={uniqueContractAddress} />
            </Box>
            <Box>
              <Anchor
                href={`${network.explorerAddress}/accounts/${uniqueContractAddress}`}
                target="_blank"
                rel="noreferrer"
                color="#6c757d"
              >
                <ContentPasteGoOutlinedIcon />
              </Anchor>
            </Box>
          </Box>
          <ReceiveModal
            showQrFromSidebar={showQr}
            address={currentContract?.address}
            handleQr={handleQrModal}
          />
        </Grid>
        <Grid item sx={{ mt: 1.2, mb: 1.1 }} sm={8.3}>
          <ReadOnly>
            Read-only
          </ReadOnly>
        </Grid>
      </Grid>
      <hr />
      <TotalBalance />
    </Box>
  );
};

export default NavbarAccountDetails;
