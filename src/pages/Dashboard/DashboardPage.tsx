/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Grid, useMediaQuery } from '@mui/material';
import { uniqueContractAddress } from 'src/multisigConfig';
import { setMultisigContracts } from 'src/redux/slices/multisigContractsSlice';
import { MultisigContractInfoType } from 'src/types/multisig/multisigContracts';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { MultiversxApiProvider } from 'src/services/MultiversxApiNetworkProvider';
import {
  Text,
  TextxSafeDescription,
} from 'src/components/StyledComponents/StyledComponents';
import { dAppName, network } from 'src/config';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ModalTypes } from 'src/types/multisig/proposals/Proposals';
import { XSafeLogo } from 'src/components/Utils/XSafeLogo';
import AddMultisigModal from '../../components/Modals/MultisigActions/AddMultisigModal';
import DeployStepsModal from '../../components/DeployMultisig/DeployMultisigModal';
import { useOrganizationInfoContext } from '../../components/Providers/OrganizationInfoContextProvider';
import * as Styled from '../../components/Modals/MultisigActions/styled';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';

function Dashboard() {
  const theme = useCustomTheme();
  const dispatch = useDispatch();
  const t = useCustomTranslation();
  const [showAddMultisigModal, setShowAddMultisigModal] = useState(false);
  const [showDeployMultisigModal, setShowDeployMultisigModal] = useState(false);
  const [invalidMultisigContract, setInvalidMultisigContract] = useState(false);
  const maxWidth600 = useMediaQuery('(max-width:600px)');

  const { isLoggedIn } = useGetLoginInfo();

  const checkSingleContractValidity = useCallback(async () => {
    if (uniqueContractAddress || !network.storageApi) {
      const isValidMultisigContract =
        await MultiversxApiProvider.validateMultisigAddress(
          uniqueContractAddress,
        );
      if (!isValidMultisigContract) {
        setInvalidMultisigContract(true);
      }
    }
  }, []);

  const handleCreateNewSafeButtonClick = useCallback(() => {
    if (isLoggedIn) {
      setShowDeployMultisigModal(true);
      return;
    }
    dispatch(
      setProposeModalSelectedOption({ option: ModalTypes.connect_wallet }),
    );
  }, [dispatch, isLoggedIn]);

  const handleAddExistingSafeButtonClick = useCallback(() => {
    if (isLoggedIn) {
      setShowAddMultisigModal(true);
      return;
    }
    dispatch(
      setProposeModalSelectedOption({ option: ModalTypes.connect_wallet }),
    );
  }, [dispatch, isLoggedIn]);

  const deployButton = (
    <Styled.CreateNewSafeButton onClick={handleCreateNewSafeButtonClick}>
      {t('Create a new Safe')}
    </Styled.CreateNewSafeButton>
  );

  const deployButtonContainer = deployButton;

  useEffect(() => {
    checkSingleContractValidity();
  }, [checkSingleContractValidity]);

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
          {
            <Grid
              container
              gap={maxWidth600 ? 0 : 3}
              paddingBottom={maxWidth600 ? '8px' : 0}
            >
              <Grid
                item
                height={'100%'}
                width={maxWidth600 ? '100%' : 'auto'}
                display={'flex'}
                flexDirection={'column'}
                flex={2}
                justifyContent={'center'}
                paddingBottom={maxWidth600 ? '66px' : 0}
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
                    <XSafeLogo width={98} height={33} />
                  </Box>
                  <TextxSafeDescription
                    margin={'12px 0 24px 0'}
                    fontWeight={500}
                  >
                    {dAppName}
                    {t(
                      ' is the first platform for digital assets management built on the MultiversX.',
                    )}
                  </TextxSafeDescription>
                </Box>
                <Grid
                  sx={{
                    width: '100%',
                    borderRadius: '10px',
                    boxShadow: maxWidth600
                      ? ''
                      : '0 5px 10px rgba(76, 47, 252, 0.03), 0px 5px 15px rgba(76, 47, 252, 0.03)',
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
                    <Box
                      sx={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Box marginY={'12px'}>
                        <Styled.AddSafeIcon />
                      </Box>
                      <Text
                        fontSize={22}
                        lineHeight={'30px'}
                        fontWeight={600}
                        marginY="8px"
                      >
                        {t('Create a new Safe')}
                      </Text>
                      <Styled.TextSafeActionDescription
                        fontSize={16}
                        marginY={'12px'}
                        fontWeight={400}
                      >
                        {t(
                          'Create a new Safe that is controlled by one or multiple owners.',
                        )}
                      </Styled.TextSafeActionDescription>
                      <Styled.TextSafeActionDescription
                        fontSize={16}
                        fontWeight={700}
                      >
                        {t(
                          'You will be required to pay a network fee for creating your new Safe.',
                        )}
                      </Styled.TextSafeActionDescription>
                    </Box>
                    <Box>{deployButtonContainer}</Box>
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
                    <Box
                      sx={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Box marginY={'12px'}>
                        <Styled.FileDownIcon />
                      </Box>
                      <Text
                        fontSize={22}
                        lineHeight={'30px'}
                        fontWeight={600}
                        marginY={'8px'}
                      >
                        {t('Load an existing Safe')}
                      </Text>
                      <Styled.TextSafeActionDescription
                        fontSize={16}
                        marginY={'12px'}
                        fontWeight={400}
                      >
                        {t(
                          'Already have a Safe or want to access it from a different device?',
                        )}
                      </Styled.TextSafeActionDescription>
                      <Styled.TextSafeActionDescription
                        fontSize={16}
                        fontWeight={700}
                      >
                        {t('Easily load your Safe using your Safe address.')}
                      </Styled.TextSafeActionDescription>
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
          }
        </Box>

        <AddMultisigModal
          show={showAddMultisigModal}
          handleClose={() => {
            setShowAddMultisigModal(false);
          }}
          setNewContracts={(newContracts) =>
            updateMultisigContract(newContracts)
          }
        />
        <DeployStepsModal
          show={showDeployMultisigModal}
          handleClose={() => setShowDeployMultisigModal(false)}
          setNewContracts={(newContracts) =>
            updateMultisigContract(newContracts)
          }
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
          setNewContracts={(newContracts) =>
            updateMultisigContract(newContracts)
          }
        />
        <DeployStepsModal
          show={showDeployMultisigModal}
          handleClose={() => setShowDeployMultisigModal(false)}
          setNewContracts={(newContracts) =>
            updateMultisigContract(newContracts)
          }
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
