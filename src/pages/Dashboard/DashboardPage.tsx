/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Box, Button, Grid } from '@mui/material';
import { uniqueContractAddress } from 'src/multisigConfig';
import { setMultisigContracts } from 'src/redux/slices/multisigContractsSlice';
import { storageApi } from 'src/services/accessTokenServices';
import { MultisigContractInfoType } from 'src/types/multisigContracts';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getIsProviderEqualTo } from '@elrondnetwork/dapp-core';
import { providerTypes } from 'src/helpers/constants';
import { useTheme } from 'styled-components';
import { ElrondApiProvider } from 'src/services/ElrondApiNetworkProvider';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { dAppName } from 'src/config';
import AddMultisigModal from './AddMultisigModal';
import DeployStepsModal from './DeployMultisigModal';
import { useOrganizationInfoContext } from '../Organization/OrganizationInfoContextProvider';
import * as Styled from './styled';

function Dashboard() {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { t }: { t: any } = useTranslation();
  const isWalletProvider = getIsProviderEqualTo(providerTypes.wallet);
  const [showAddMultisigModal, setShowAddMultisigModal] = useState(false);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = useState(false);
  const [invalidMultisigContract, setInvalidMultisigContract] = useState(false);

  async function checkSingleContractValidity() {
    if (uniqueContractAddress || !storageApi) {
      const isValidMultisigContract = await ElrondApiProvider.validateMultisigAddress(
        uniqueContractAddress,
      );
      if (!isValidMultisigContract) {
        setInvalidMultisigContract(true);
      }
    }
  }

  const deployButton = (
    <Styled.CreateNewSafeButton
      disabled={isWalletProvider}
      onClick={() => setShowDeployMultisigModal(true)}
      sx={{
        width: '100%',
        background: '#4c2ffc',
        color: '#fff',
        borderRadius: 0,
        padding: '1.5rem',
        borderTop: '1px solid rgba(76, 47, 252, 0.54)',
        pointerEvents: isWalletProvider ? 'none' : 'auto',
        '&:hover': {
          backgroundColor: theme.palette.background.button,
          borderColor: theme.palette.background.button,
          color: theme.palette.background.white,
        },
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
      <span className="d-inline-block">{deployButton}</span>
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
        <Box paddingLeft={3}>
          { (
            <Grid container gap={3}>
              <Grid item height={'100%'} display={'flex'} flexDirection={'column'} flex={2} justifyContent={'center'}>
                <Box>
                  <Text fontSize={36} fontWeight={700}>
                    {t(`Welcome to ${dAppName}`)}
                  </Text>
                  <Text marginY={3} fontSize={16} fontWeight={400}>
                    {t(`${dAppName} is the first platform for digital assets management built on the Elrond Network.`)}
                  </Text>
                </Box>
                <Grid
                  sx={{ width: '100%',
                    borderRadius: '10px',
                    boxShadow: '0 5px 10px rgba(76, 47, 252, 0.03), 0px 5px 15px rgba(76, 47, 252, 0.03)',
                    backgroundColor: theme.palette.background.secondary,
                    border: 'none',
                    overflow: 'hidden',
                    height: '100%',
                  }}
                  container
                >
                  <Grid
                    item
                    flex={1}
                    xs={12}
                    md={6}
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                  >
                    <Box sx={{ padding: '2rem 3rem', display: 'flex', flexDirection: 'column' }}>
                      <Box marginY={'1rem'}><AddRoundedIcon sx={{ color: 'rgba(76, 47, 252, 0.54)',
                      }}
                      />
                      </Box>
                      <Text fontSize={24} fontWeight={600} marginY={'1rem'}>{t('Create a new Safe')}</Text>
                      <Text
                        fontSize={17}
                        marginY={'1rem'}
                      >{t('Create a new Safe that is controlled by one or multiple owners.')}
                      </Text>
                      <Text
                        fontSize={17}
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
                    md={6}
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    sx={{
                      borderLeft: `1px solid ${theme.palette.divider.secondary} `,
                    }}
                  >
                    <Box sx={{ padding: '2rem 3rem', display: 'flex', flexDirection: 'column' }}>
                      <Box marginY={'1rem'}><FileDownloadRoundedIcon sx={{ color: 'rgba(76, 47, 252, 0.54)',
                      }}
                      />
                      </Box>
                      <Text fontSize={24} fontWeight={600} marginY={'1rem'}>{t('Load an existing Safe')}</Text>
                      <Text
                        fontSize={17}
                        marginY={'1rem'}
                      >{t('Already have a Safe or want to access it from a different device?')}
                      </Text>
                      <Text
                        fontSize={17}
                        fontWeight={700}
                      >{t('Easily load your Safe using your Safe address.')}
                      </Text>
                    </Box>
                    <Styled.LoadSafeButton
                      onClick={() => setShowAddMultisigModal(true)}
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
