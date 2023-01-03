/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Box, Button, Grid, useMediaQuery } from '@mui/material';
import { uniqueContractAddress } from 'src/multisigConfig';
import { setMultisigContracts } from 'src/redux/slices/multisigContractsSlice';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { refreshAccount } from '@elrondnetwork/dapp-core/utils';
import { useGetAccountProvider, useGetLoginInfo } from '@elrondnetwork/dapp-core/hooks/account';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { useTheme } from 'styled-components';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { dAppName, network } from 'src/config';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes } from 'src/types/Proposals';
import { LoginMethodsEnum } from '@elrondnetwork/dapp-core/types';
import xSafeLogo from 'src/assets/img/xSafe-Logo.svg';
import AddMultisigModal from './AddMultisigModal';
import DeployStepsModal from './DeployMultisigModal';
import { useOrganizationInfoContext } from '../Organization/OrganizationInfoContextProvider';
import * as Styled from './styled';

function Dashboard() {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { t }: { t: any } = useTranslation();
  const { providerType } = useGetAccountProvider();
  const isWalletProvider = providerType === LoginMethodsEnum.wallet;
  const [showAddMultisigModal, setShowAddMultisigModal] = useState(false);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = useState(false);
  const [invalidMultisigContract, setInvalidMultisigContract] = useState(false);
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const { isLoggedIn } = useGetLoginInfo();
  const { address } = useGetAccountInfo();

  useEffect(() => {
    if (isLoggedIn) {
      refreshAccount();
    }
  }, [isLoggedIn, address, dispatch]);

  async function checkSingleContractValidity() {
    if (uniqueContractAddress || !network.storageApi) {
      const isValidMultisigContract = await ElrondApiProvider.validateMultisigAddress(
        uniqueContractAddress,
      );
      if (!isValidMultisigContract) {
        setInvalidMultisigContract(true);
      }
    }
  }

  const handleCreateNewSafeButtonClick = useCallback(() => {
    if (isLoggedIn) {
      setShowDeployMultisigModal(true);
      return;
    }
    dispatch(setProposeModalSelectedOption({ option: ProposalsTypes.connect_wallet }));
  }, [dispatch, isLoggedIn]);

  const handleAddExistingSafeButtonClick = useCallback(() => {
    if (isLoggedIn) {
      setShowAddMultisigModal(true);
      return;
    }
    dispatch(setProposeModalSelectedOption({ option: ProposalsTypes.connect_wallet }));
  }, [dispatch, isLoggedIn]);

  const deployButton = (
    <Styled.CreateNewSafeButton
      disabled={isWalletProvider}
      onClick={handleCreateNewSafeButtonClick}
      sx={{
        pointerEvents: isWalletProvider ? 'none' : 'auto',
      }}
    >
      {t('Create a new Safe')}
    </Styled.CreateNewSafeButton>
  );

  const deployButtonContainer = isWalletProvider ? (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={(props) => (
        <Tooltip id="deploy-button-tooltip" {...props}>
          {t('Please use another login method to deploy a contract')}
        </Tooltip>
      )}
    >
      <Box>{deployButton}</Box>
    </OverlayTrigger>
  ) : (
    deployButton
  );

  useEffect(() => {
    checkSingleContractValidity();
  }, []);

  async function updateMultisigContract(
    newContracts: MultisigContractInfoType[],
  ) {
    dispatch(setMultisigContracts(newContracts));
  }
  const { isMultiWalletMode } = useOrganizationInfoContext();

  if (isMultiWalletMode) {
    return (
      <>
        <Box>
          { (
            <Grid container gap={maxWidth600 ? 0 : 3} paddingBottom={maxWidth600 ? '37px' : 0}>
              <Grid
                item
                height={'100%'}
                width={maxWidth600 ? '100%' : 'auto'}
                display={'flex'}
                flexDirection={'column'}
                flex={2}
                justifyContent={'center'}
              >
                <Box>
                  <Box display="flex" alignItems="center">
                    <Text
                      mr={1.2}
                      fontSize={maxWidth600 ? 24 : 40}
                      lineHeight={maxWidth600 ? '28px' : '44px'}
                      fontWeight="medium"
                    >
                      {t('Welcome to')}
                    </Text>
                    <img width="98" height="33" src={xSafeLogo} alt="logo" />
                  </Box>
                  <Text marginY={2} fontSize={16} fontWeight={400}>
                    <strong>{dAppName}</strong>
                    {t(' is the first platform for digital assets management built on the MultiversX.')}
                  </Text>
                </Box>
                <Grid
                  sx={{ width: '100%',
                    borderRadius: '10px',
                    boxShadow: maxWidth600 ? '' :
                      '0 5px 10px rgba(76, 47, 252, 0.03), 0px 5px 15px rgba(76, 47, 252, 0.03)',
                    border: 'none',
                    overflow: 'hidden',
                    height: '100%',
                    display: maxWidth600 ? 'flex' : '',
                    flexDirection: maxWidth600 ? 'column' : 'auto',
                    maxWidth: '793px',
                  }}
                  container
                >
                  <Grid
                    item
                    flex={1}
                    xs={12}
                    sm={6}
                    md={6}
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    marginBottom={maxWidth600 ? '24px' : 0}
                    borderRadius={maxWidth600 ? '10px' : 0}
                    sx={{ backgroundColor: theme.palette.background.secondary }}
                  >
                    <Box sx={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                      <Box marginY={'12px'}><AddRoundedIcon sx={{ color: 'rgba(76, 47, 252, 0.54)',
                      }}
                      />
                      </Box>
                      <Text
                        fontSize={22}
                        lineHeight={'30px'}
                        fontWeight={600}
                        marginY="8px"
                      >{t('Create Safe')}
                      </Text>
                      <Text
                        fontSize={16}
                        marginY={'12px'}
                      >{t('Create a new Safe that is controlled by one or multiple owners.')}
                      </Text>
                      <Text
                        fontSize={16}
                        fontWeight={700}
                      >{t('You will be required to pay a network fee for creating your new Safe.')}
                      </Text>
                    </Box>
                    <Box>
                      {deployButtonContainer}
                    </Box>
                  </Grid>
                  <Grid
                    flex={1}
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    sx={{
                      borderLeft: `1px solid ${theme.palette.divider.secondary} `,
                      backgroundColor: theme.palette.background.secondary,
                    }}
                    borderRadius={maxWidth600 ? '10px 10px 0 0' : 0}
                  >
                    <Box sx={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                      <Box marginY={'12px'}><FileDownloadRoundedIcon sx={{ color: 'rgba(76, 47, 252, 0.54)',
                      }}
                      />
                      </Box>
                      <Text
                        fontSize={22}
                        lineHeight={'30px'}
                        fontWeight={600}
                        marginY={'8px'}
                      >{t('Load Existing Safe')}
                      </Text>
                      <Text
                        fontSize={16}
                        marginY={'12px'}
                      >{t('Already have a Safe or want to access it from a different device?')}
                      </Text>
                      <Text
                        fontSize={16}
                        fontWeight={700}
                      >{t('Easily load your Safe using your Safe address.')}
                      </Text>
                    </Box>
                    <Styled.LoadSafeButton
                      onClick={handleAddExistingSafeButtonClick}
                    >
                      {t('Load an existing Safe')}
                    </Styled.LoadSafeButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={0} lg={3} />
            </Grid>
          ) }
        </Box>

        <AddMultisigModal
          show={showAddMultisigModal}
          handleClose={() => {
            setShowAddMultisigModal(false);
          }}
          setNewContracts={(newContracts) => updateMultisigContract(newContracts)}
        />
        <DeployStepsModal
          show={showDeployMultisigModal}
          handleClose={() => setShowDeployMultisigModal(false)}
          setNewContracts={(newContracts) => updateMultisigContract(newContracts)}
        />
      </>
    );
  }

  if (invalidMultisigContract) {
    return (
      <>
        <div className="d-flex flex-fill justify-content-center align-items-center flex-column">
          <p className="h2">
            {t(
              'The address you provided does not belong to a valid Multisig contract',
            )}
          </p>
          <p className="h3 mt-5">
            {t(
              'Please check project configuration in multisigConfig and try again',
            )}
          </p>
        </div>
        <AddMultisigModal
          show={showAddMultisigModal}
          handleClose={() => {
            setShowAddMultisigModal(false);
          }}
          setNewContracts={(newContracts) => updateMultisigContract(newContracts)}
        />
        <DeployStepsModal
          show={showDeployMultisigModal}
          handleClose={() => setShowDeployMultisigModal(false)}
          setNewContracts={(newContracts) => updateMultisigContract(newContracts)}
        />
      </>
    );
  }

  return (
    <div className="owner w-100 d-flex justify-content-center align-items-center flex-column">
      <p className="info-msg">
        New to Multisig?&nbsp;&nbsp;&nbsp;&nbsp;
        <Button variant="text">Learn more</Button>
      </p>
    </div>
  );
}

export default Dashboard;
