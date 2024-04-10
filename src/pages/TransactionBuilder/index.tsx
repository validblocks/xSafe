/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Yup from 'yup';
import {
  Box,
  MenuItem,
  Stack,
  Switch,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import { SettingsWrapper } from '../../components/Settings/settings-style';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import AddressInput from 'src/components/Utils/AdressInput';
import makeStyles from '@mui/styles/makeStyles/makeStyles';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AbiRegistry,
  Address,
  SmartContract,
  BigUIntValue,
  BytesValue,
} from '@multiversx/sdk-core/out';
import {
  MainButton,
  MainSelect,
  TextInput,
} from 'src/components/Theme/StyledComponents';
import { Dropzone } from 'src/components/TransactionBuilder/DropZone';
import AmountInputWithTokenSelection from 'src/components/Utils/AmountInputWithTokenSelection';
import { FormikProps, useFormik } from 'formik';
import { TestContext } from 'yup';
import { organizationTokensSelector } from 'src/redux/selectors/accountSelector';
import { useSelector } from 'react-redux';
import { OrganizationToken } from 'src/types/organization';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import { useCustomTranslation } from 'src/hooks/useCustomTranslation';
import { AnimatePresence, motion } from 'framer-motion';
import { LOCAL_STORAGE_KEYS } from 'src/components/Marketplace/localStorageKeys';
import { useLocalStorage } from 'src/hooks/useLocalStorage';
import { isAddressValid } from 'src/helpers/validation';

interface IFormValues {
  amount: string;
}

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#4c2ffc' : '#4c2ffc',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,.35)'
        : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

export const TransactionBuilder = () => {
  const theme = useCustomTheme();
  const t = useCustomTranslation();

  const useStyles = makeStyles(() => ({
    dropdown: {
      '& .MuiPaper-root': {
        marginTop: '6px',
        width: '155px',
        backgroundColor: theme.palette.background.secondary,
        '& .MuiButtonBase-root': {
          color: theme.palette.text.primary,
        },
      },
      '@media (max-width:600px)': {
        '& .MuiPaper-root': {
          width: '100%',
        },
      },
    },
  }));
  const styleProp = useStyles();

  const minWidth600 = useMediaQuery('(min-width:600px)');
  const minWidth1120 = useMediaQuery('(min-width:1120px)');

  const [error, _setError] = useState(false);
  const [useAbi, setUseAbi] = useState(true);
  const [localStorageAbi, setLocalStorageAbi] = useLocalStorage(
    LOCAL_STORAGE_KEYS.UPLOADED_ABI_TEXT,
    '',
  );
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [abiParsingError, setAbiParsingError] = useState<string | null>(null);
  const [selectedAddressParam, setSelectedAddressParam] =
    useState<Address | null>(null);
  const [availableContractEndpoints, setAvailableContractEndpoints] = useState<
    string[] | null
  >(null);
  const [smartContract, setSmartContract] = useState<SmartContract | null>(
    null,
  );
  const [inputParamsForm, setInputParamsForm] = useState<
    Record<string, string>
  >({});

  const organizationTokens = useSelector(organizationTokensSelector);
  const egldBalanceString =
    organizationTokens
      ?.find((token: OrganizationToken) => token.identifier === 'EGLD')
      .tokenAmount.replaceAll(',', '') ?? 0;

  const balance = Number(egldBalanceString);

  const formik: FormikProps<IFormValues> = useFormik({
    initialValues: {
      amount: 0,
    },
    validationSchema: Yup.object().shape({
      receiver: Yup.string()
        .min(2, 'Too Short!')
        .max(62, 'Too Long!')
        .required('Required')
        .test(isAddressValid),
      amount: Yup.string()
        .required('Required')
        .transform((value) => value.replace(',', ''))
        .test((value?: string, testContext?: TestContext) => {
          const newAmount = Number(value);
          if (Number.isNaN(newAmount)) {
            return (
              testContext?.createError({
                message: 'Invalid amount',
              }) ?? false
            );
          }
          if (newAmount < 0) {
            formik.setFieldValue('amount', 0);
          }

          if (newAmount > Number(balance)) {
            return (
              testContext?.createError({
                message: 'Insufficient funds',
              }) ?? false
            );
          }

          return true;
        }),
      data: Yup.string(),
    }),
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const { errors, values } = formik;
  const { amount } = values;

  const amountError = errors.amount;

  const isCreateProposalButtonActive = useMemo(() => {
    return (
      !amountError &&
      selectedEndpoint &&
      smartContract &&
      selectedAddressParam &&
      selectedAddressParam.bech32().length > 0
    );
  }, [amountError, selectedAddressParam, selectedEndpoint, smartContract]);

  useEffect(() => {
    try {
      const abiRegistry = AbiRegistry.create(
        JSON.parse(localStorageAbi ?? null),
      );
      const existingContract = new SmartContract({
        abi: abiRegistry,
      });

      const endpoints = existingContract.methods;

      setAvailableContractEndpoints(Object.keys(endpoints));
      setSmartContract(existingContract);
      setSelectedEndpoint(Object.keys(endpoints)?.[0]);
    } catch (e) {
      console.error(e);
      setAbiParsingError('Invalid ABI');
      setSmartContract(null);
    }
  }, [localStorageAbi]);

  const selectedEndpointParams = useMemo(() => {
    try {
      if (!selectedEndpoint || !smartContract) return [];

      const inputParams = smartContract.getEndpoint(selectedEndpoint).input;

      return inputParams;
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [selectedEndpoint, smartContract]);

  const focusInput = useCallback(
    (input: HTMLInputElement) => {
      if (minWidth600) input?.focus();
    },
    [minWidth600],
  );
  const handleAddressParamChange = useCallback(
    (value: Address) => {
      setSelectedAddressParam(value);
    },
    [setSelectedAddressParam],
  );

  const updateAbiTextContent = useCallback(
    (content: string) => {
      setLocalStorageAbi(content);
    },
    [setLocalStorageAbi],
  );

  const handleAbiAsTextChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalStorageAbi(event?.target.value);
    },
    [setLocalStorageAbi],
  );

  const handleSelectEndpoint = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedEndpoint(value);
    },
    [],
  );

  const handleInputParamsFormChange = useCallback(
    (inputFormName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputParamsForm((oldForm) => ({
        ...oldForm,
        [inputFormName]: e.target.value,
      }));
    },
    [],
  );

  const onCreateProposalClick = useCallback(async () => {
    if (!selectedEndpoint || !selectedAddressParam) return;

    const collectedParams = Object.values(inputParamsForm);

    const futureCallAmount = new BigUIntValue(
      new BigNumber(Number(amount.replaceAll(',', '')))
        .shiftedBy(18)
        .decimalPlaces(0, BigNumber.ROUND_FLOOR),
    );

    await mutateSmartContractCall(
      selectedAddressParam,
      futureCallAmount,
      selectedEndpoint,
      ...collectedParams.map((p) => BytesValue.fromHex(p)),
    );
  }, [selectedAddressParam, amount, inputParamsForm, selectedEndpoint]);

  return (
    <Box>
      <Box pb={2}>
        <Text
          sx={{
            fontWeight: 'bold !important',
            fontSize: '1.5rem',
          }}
        >
          Smart Contract Interactions
        </Text>
      </Box>
      <Box paddingBottom="24px" display="flex" flexWrap="wrap">
        <Box minWidth={minWidth600 ? '500px' : '100%'} maxWidth="550px">
          <SettingsWrapper p={0}>
            <Box
              sx={{
                p: '1.75rem 2rem',
                borderBottom: `2px solid ${theme.palette.background.default}`,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center !important' }}>
                <Text
                  sx={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  {t('New Transaction')}
                </Text>
              </Box>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Custom Data</Typography>
                  <AntSwitch
                    defaultChecked
                    onChange={() => setUseAbi(!useAbi)}
                    value={useAbi}
                    inputProps={{ 'aria-label': 'ant design' }}
                  />
                  <Typography>Use ABI</Typography>
                </Stack>
              </Box>
            </Box>
            <Box p="2rem" pb={useAbi ? '2rem' : 1}>
              <Box pb={2}>
                <AddressInput
                  placeholder="Enter Smart Contract Address"
                  label="Smart Contract Address"
                  handleParamsChange={handleAddressParamChange}
                />
              </Box>
              <Box>
                <AmountInputWithTokenSelection
                  amount={amount}
                  amountError={amountError}
                  formik={formik}
                  handleInputBlur={formik.handleBlur}
                  handleInputChange={formik.handleChange}
                  resetAmount={() => formik.setFieldValue('amount', 0)}
                  config={{
                    withTokenSelection: false,
                    withAvailableAmount: true,
                  }}
                />
              </Box>
              <AnimatePresence initial={false}>
                {useAbi && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: 'auto',
                      transition: {
                        height: {
                          duration: 0.4,
                        },
                        opacity: {
                          duration: 0.25,
                        },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      height: useAbi ? 0 : 'auto',
                      transition: {
                        height: {
                          duration: 0.4,
                        },
                        opacity: {
                          duration: 0.25,
                        },
                      },
                    }}
                  >
                    <TextInput
                      multiline
                      maxRows="6"
                      error={undefined}
                      label={`Smart Contract ABI`}
                      placeholder={`Paste Smart Contract ABI`}
                      value={localStorageAbi}
                      inputRef={focusInput}
                      autoComplete="off"
                      onChange={handleAbiAsTextChanged}
                      helperText={error ? abiParsingError : null}
                      className={error ? 'isAddressError' : ''}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
            {smartContract && (
              <Box>
                <Box
                  sx={{
                    p: '2rem',
                    borderTop: `2px solid ${theme.palette.background.default}`,
                  }}
                >
                  <Text
                    sx={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    Transaction Information
                  </Text>
                </Box>
                <Box sx={{ px: '2rem' }}>
                  {availableContractEndpoints &&
                  availableContractEndpoints?.length > 0 ? (
                    <Box>
                      <MainSelect
                        id="endpoint-select"
                        value={
                          selectedEndpoint ?? availableContractEndpoints?.[0]
                        }
                        sx={{
                          width: '100%',
                          padding: '16px 14px !important',
                          '& .MuiSelect-select.MuiInputBase-input.MuiInput-input':
                            {
                              padding: '0 !important',
                            },
                        }}
                        size="medium"
                        variant="standard"
                        MenuProps={{ className: styleProp.dropdown }}
                        onChange={handleSelectEndpoint}
                      >
                        {availableContractEndpoints?.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </MainSelect>
                    </Box>
                  ) : (
                    <Box>
                      <Text
                        sx={{
                          fontSize: '14px',
                        }}
                      >
                        No endpoints on the provided ABI.
                      </Text>
                    </Box>
                  )}
                </Box>
                <Box p="2rem" pt={0}>
                  {selectedEndpointParams.map((inputParam) => (
                    <Box key={inputParam.name} pt={2}>
                      <TextInput
                        label={`${
                          inputParam.name
                        } (${inputParam.type.getName()} in hex)`}
                        placeholder={`${
                          inputParam.name
                        } (${inputParam.type.getName()} in hex)`}
                        value={inputParamsForm[inputParam.name]}
                        autoComplete="off"
                        onChange={handleInputParamsFormChange(inputParam.name)}
                        className={error ? 'isAddressError' : ''}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            <Box p="2rem" pt={0}>
              <MainButton
                disabled={!isCreateProposalButtonActive}
                onClick={onCreateProposalClick}
                onKeyDown={(e) => e.preventDefault()}
                onKeyUp={(e) => e.preventDefault()}
                sx={{ boxShadow: 'none !important', width: '100%' }}
              >
                {t('Create proposal')}
              </MainButton>
            </Box>
          </SettingsWrapper>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          pt={minWidth1120 ? 12 : 2}
          sx={{
            minWidth: minWidth1120
              ? '320px'
              : minWidth600
              ? `min(100%, 500px)`
              : '100%',
            height: minWidth1120 ? '200px' : '120px',
            px: minWidth1120 ? 2 : 0,
          }}
        >
          <Dropzone handleTextFileContent={updateAbiTextContent} />
        </Box>
      </Box>
    </Box>
  );
};
