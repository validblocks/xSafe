/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Yup from 'yup';
import { Box, MenuItem, useMediaQuery } from '@mui/material';
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

interface IFormValues {
  amount: string;
}

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
  const [abiAsText, setAbiAsText] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [abiParsingError, setAbiParsingError] = useState<string | null>(null);
  const [selectedAddressParam, setSelectedAddressParam] = useState(
    new Address(),
  );
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
        .test((value?: string) => {
          try {
            new Address(value);
            return true;
          } catch (err) {
            return false;
          }
        }),
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
    console.log({
      amountError,
      selectedEndpoint,
      smartContract,
      selectedAddressParam,
    });
    return (
      !amountError &&
      selectedEndpoint &&
      smartContract &&
      selectedAddressParam.bech32().length > 0
    );
  }, [amountError, selectedAddressParam, selectedEndpoint, smartContract]);

  useEffect(() => {
    try {
      const abiRegistry = AbiRegistry.create(JSON.parse(abiAsText ?? null));
      const existingContract = new SmartContract({
        abi: abiRegistry,
      });

      const endpoints = existingContract.methods;

      setAvailableContractEndpoints(Object.keys(endpoints));
      setSmartContract(existingContract);
      setSelectedEndpoint(Object.keys(endpoints)?.[0]);
      console.log({ endpoints });
    } catch (e) {
      console.error(e);
      setAbiParsingError('Invalid ABI');
      setSmartContract(null);
    }
  }, [abiAsText]);

  const selectedEndpointParams = useMemo(() => {
    try {
      console.log({ selectedEndpoint, smartContract });
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
  const handleAddressParamChange = useCallback((value: Address) => {
    setSelectedAddressParam(value);
  }, []);

  const updateAbiTextContent = useCallback((content: string) => {
    setAbiAsText(content);
  }, []);

  const handleAbiAsTextChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateAbiTextContent(event?.target.value);
    },
    [updateAbiTextContent],
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

  const onCreateProposalClick = useCallback(() => {
    if (!selectedEndpoint || !selectedAddressParam) return;

    const collectedParams = Object.values(inputParamsForm);

    mutateSmartContractCall(
      selectedAddressParam,
      new BigUIntValue(new BigNumber(Number(amount))),
      selectedEndpoint ?? '',
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
          Transaction Builder
        </Text>
      </Box>
      <Box paddingBottom="24px" display="flex" flexWrap="wrap">
        <Box minWidth={minWidth600 ? '500px' : '100%'} maxWidth="550px">
          <SettingsWrapper p={0}>
            <Box
              sx={{
                p: '2rem',
                borderBottom: `2px solid ${theme.palette.background.default}`,
              }}
            >
              <Text
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {t('New Transaction')}
              </Text>
            </Box>
            <Box sx={{ p: '2rem' }}>
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
              <Box>
                <TextInput
                  multiline
                  maxRows="6"
                  error={undefined}
                  label={`Smart Contract ABI`}
                  placeholder={`Paste Smart Contract ABI`}
                  value={abiAsText}
                  inputRef={focusInput}
                  autoComplete="off"
                  onChange={handleAbiAsTextChanged}
                  helperText={error ? abiParsingError : null}
                  className={error ? 'isAddressError' : ''}
                />
              </Box>
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
