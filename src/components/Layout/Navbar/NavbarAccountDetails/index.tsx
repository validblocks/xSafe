import React, { useState, useEffect, useCallback } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Box, Button, Typography } from '@mui/material';
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
import styles from './NavbarAccountDetails.module.css';

const NavbarAccountDetails = ({ uniqueAddress }: { uniqueAddress: string }) => {
  const dispatch = useDispatch();
  const currentContract = useSelector(currentMultisigContractSelector);
  const [showQr, setShowQr] = useState(false);

  const {
    tokenPrices,
    membersCountState: [membersCount]
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
      <Box className={styles.navbarAccountDetails}>
        <Box sx={{ textAlign: 'center' }} className={styles.safeNmembers}>
          <Box>
            <img src={Safe} width='60px' height='60px' />
          </Box>
          <Box className={styles.membersBox}>
            <MembersBox borderRadius='.2rem !important'>
              <Typography>{membersCount}</Typography>
            </MembersBox>
          </Box>
        </Box>
        <Box className={styles.uniqueAddressNicons} sx={{ ml: 1 }}>
          <Box className='d-flex justify-content-center align-items-center'>
            <Typography align='center'>{uniqueAddress}</Typography>
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <Box
              onClick={handleQrModal}
              sx={{
                mr: 1.4,
                ml: 0.7,
                cursor: 'pointer'
              }}
            >
              <QrCode2Icon />
            </Box>
            <Box sx={{ mr: 1.4 }}>
              <CopyButton text={uniqueContractAddress} />
            </Box>
            <Box>
              <Anchor
                href={`https://devnet-explorer.elrond.com/accounts/${uniqueContractAddress}`}
                target='_blank'
                rel='noreferrer'
                color='#6c757d'
              >
                <ContentPasteSearchIcon />
              </Anchor>
            </Box>
          </Box>
          <ReceiveModal
            showQrFromSidebar={showQr}
            address={currentContract?.address}
            handleQr={handleQrModal}
          />
        </Box>
        <Box sx={{ mt: 1.2, mb: 2 }} className={styles.readOnly}>
          <ReadOnly borderRadius='.4rem !important' sx={{ px: 2 }}>
            Read-only
          </ReadOnly>
        </Box>
      </Box>
      <hr className={styles.horizontalRule} />
      <TotalBalance />
    </Box>
  );
};

export default NavbarAccountDetails;
