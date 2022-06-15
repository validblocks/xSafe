import React, { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Safe from 'assets/img/safe.png';
import CopyButton from 'components/CopyButton';
import ReceiveModal from 'components/ReceiveModal';
import SafeOptions from 'components/SafeOptions';
import { uniqueContractAddress } from 'multisigConfig';
import { useOrganizationInfoContext } from 'pages/Organization/OrganizationInfoContextProvider';
import { currentMultisigContractSelector } from 'redux/selectors/multisigContractsSelectors';
import { Anchor, ReadOnly, MembersBox } from '../navbar-style';
import TotalBalance from '../TotalBalance';

const NavbarAccountDetails = ({ uniqueAddress }: { uniqueAddress: string }) => {
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);
  const [showQr, setShowQr] = useState(false);

  const {
    tokenPrices,
    membersCountState: [membersCount],
  } = useOrganizationInfoContext();

  const [openedSafeSelect, setOpenedSafeSelect] = useState(false);

  const handleQrModal = () => {
    setShowQr(!showQr);
  };

  const closeSafeDropdown = (data: boolean) => {
    setOpenedSafeSelect(data);
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center' }}>
        <Box>
          <img src={Safe} width="91px" height="91px" />
        </Box>
        <Box>
          <MembersBox>
            <Typography>
              {membersCount}
              {' '}
              {membersCount == 1 ? 'Member' : 'Members'}
            </Typography>
          </MembersBox>
        </Box>
        <Box
          sx={{ pt: 1 }}
          className="d-flex justify-content-center align-items-center"
        >
          <Typography align="center">{uniqueAddress}</Typography>
          {openedSafeSelect === true && (
            <Box>
              <ArrowDropUpIcon
                onClick={() => {
                  setOpenedSafeSelect(false);
                }}
              />
              <SafeOptions closeSafeDropdown={closeSafeDropdown} />
            </Box>
          )}
          {openedSafeSelect === false && (
            <Box>
              <ArrowDropDownIcon
                onClick={() => {
                  setOpenedSafeSelect(true);
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Box className="d-flex justify-content-center" sx={{ pt: 1 }}>
        <Box onClick={handleQrModal} sx={{ mx: 1, cursor: 'pointer' }}>
          <QrCode2Icon />
        </Box>
        <Box sx={{ mx: 1 }}>
          <CopyButton text={uniqueContractAddress} />
        </Box>
        <Box sx={{ mx: 1 }}>
          <Anchor
            href={`https://devnet-explorer.elrond.com/accounts/${uniqueContractAddress}`}
            target="_blank"
            rel="noreferrer"
            color="#6c757d"
          >
            <ContentPasteSearchIcon />
          </Anchor>
        </Box>
        <ReceiveModal
          showQrFromSidebar={showQr}
          address={currentContract?.address}
          handleQr={handleQrModal}
        />
      </Box>
      <Box sx={{ mt: 2 }} className="d-flex justify-content-center">
        <ReadOnly sx={{ px: 2 }}>Read-only</ReadOnly>
      </Box>
      <TotalBalance />
    </Box>
  );
};

export default NavbarAccountDetails;
