import React, { useEffect, useMemo } from 'react';
import { FormikProps, useFormik } from 'formik';
import { FormikInputField } from 'src/helpers/formikFields';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectedNftToSendSelector } from 'src/redux/selectors/modalsSelector';
import { Address } from '@multiversx/sdk-core/out';
import { MultisigSendNft } from 'src/types/MultisigSendNft';
import { useQueryClient } from 'react-query';
import useNft from 'src/utils/useNft';
import MemberPresentationWithPhoto from 'src/pages/Organization/MemberPresentationWithPhoto';
import { AccordionDetails, Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Styled from '../../../components/Utils/styled';

interface ProposeSendNftType {
  handleChange: (proposal: MultisigSendNft) => void;
  setSubmitDisabled: (value: boolean) => void;
}

interface IFormValues {
  address: string;
  identifier: string;
  nonce: string;
}

function validateRecipient(value?: string) {
  try {
    // eslint-disable-next-line no-new
    new Address(value);
    return true;
  } catch (err) {
    return false;
  }
}

const ProposeSendNft = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSendNftType) => {
  const { t } = useTranslation();

  let formik: FormikProps<IFormValues>;

  const selectedNft = useSelector(selectedNftToSendSelector);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        address: Yup.string()
          .min(2, 'Too Short!')
          .max(500, 'Too Long!')
          .required('Required')
          .test(validateRecipient),
        identifier: Yup.string().required('Required'),
        nonce: Yup.string().required('Required'),
      }),
    [],
  );

  // eslint-disable-next-line prefer-const
  formik = useFormik({
    initialValues: {
      address: '',
      identifier: selectedNft?.identifier ?? '',
      nonce: selectedNft?.nonce ?? '',
    },
    onSubmit: () => undefined,
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const queryClient = useQueryClient();

  const { searchedNft } = useNft(queryClient, selectedNft.identifier);

  const { touched, errors, values } = formik;
  // eslint-disable-next-line prefer-const
  let { address, identifier, nonce } = values;

  const getProposal = (): MultisigSendNft | null => {
    try {
      const parsedAddress = new Address(address);
      return new MultisigSendNft(parsedAddress, identifier, nonce);
    } catch (err) {
      return null;
    }
  };

  const refreshProposal = () => {
    setTimeout(() => {
      const proposal = getProposal();

      if (proposal !== null) {
        handleChange(proposal);
      }
    }, 100);
  };

  const addressError = touched.address && errors.address;
  setSubmitDisabled(!formik.isValid || !formik.dirty);
  useEffect(() => {
    setSubmitDisabled(!(formik.isValid && formik.dirty));
  }, [address, identifier, nonce]);

  React.useEffect(() => {
    refreshProposal();
  }, [address, identifier, nonce]);

  const { address: address2 } = useGetAccountInfo();

  const memoizedAddress = useMemo(() => new Address(address2), [address2]);

  const maxWidth600 = useMediaQuery('(max-width:600px)');

  return (
    <Box>
      <Box sx={{ p: maxWidth600 ? '16px' : '16px 48px 0.9rem' }}>
        {/* <Typography sx={{ mb: '0.5rem', fontWeight: 500 }}><Text>NFT name:</Text></Typography> */}
        <Grid container className="mb-3 d-flex" spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img src={searchedNft.url} alt="Nft Preview" className="rounded mr-2 w-100" />
          </Grid>

        </Grid>
        <Accordion sx={{
          background: '#D6CFFF1A',
          border: '1px solid #D6CFFF1A',
          // border: '1px solid #312870',
          color: '#fff',
          borderRadius: '4px',
          // background: 'rgba(76, 47, 252, 0.1)',
          mb: 2,
        }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#ddd' }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>More Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid
              item
              xs={12}
            >
              <Box>
                <Box pb={2} display="flex" justifyContent="space-between">
                  <Text fontWeight={600}>Token ID:</Text>
                  <Text>{searchedNft.name}</Text>
                </Box>
                <Box pb={2} display="flex" justifyContent="space-between">
                  <Text fontWeight={600} mr={1}>Royalties:</Text>
                  <Text>{searchedNft.royalties}%</Text>
                </Box>
                <Box pb={2} display="flex" justifyContent="space-between">
                  <Text fontWeight={600} mr={1}>Rank:</Text>
                  <Text>#{searchedNft.rank}</Text>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Text fontWeight={600} mr={1}>Token Type:</Text>
                  <Text>{searchedNft.type}</Text>
                </Box>
              </Box>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{
          background: '#D6CFFF1A',
          border: '1px solid #D6CFFF1A',
          // border: '1px solid #312870',
          color: '#fff',
          borderRadius: '4px',
          // background: 'rgba(76, 47, 252, 0.1)',
          mb: 2,
        }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#ddd' }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Attributes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid
              item
              xs={12}
            >
              <Box>
                {
                  searchedNft.metadata?.attributes?.map((attribute: {value: string, trait_type: string}) => (
                    <Box pb={2} display="flex" justifyContent="space-between">
                      <Text fontWeight={600}>{attribute.trait_type}:</Text>
                      <Text overflow="hidden">{attribute.value}</Text>
                    </Box>
                  ))
                }

              </Box>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Box sx={{
          p: 2,
          height: '100%',
          background: '#D6CFFF1A',
          border: '1px solid #D6CFFF1A',
          // border: '1px solid #312870',
          // background: 'rgba(76, 47, 252, 0.1)',
          borderRadius: '4px',
        }}
        >

          <Typography sx={{ mb: '0.5rem', fontWeight: 500 }}>
            <Text>Sending from:</Text>
          </Typography>
          <MemberPresentationWithPhoto
            memberAddress={memoizedAddress}
            charactersLeftAfterTruncation={15}
          />
        </Box>

      </Box>
      <Styled.ModalDivider />
      <Box sx={{ p: maxWidth600 ? '1.25rem 16px 0' : '1.25rem 48px 0', m: ' 0 0 1rem' }}>
        <FormikInputField
          label={t('Send to')}
          name={'address'}
          value={address}
          handleChange={formik.handleChange}
          error={addressError}
          handleBlur={formik.handleBlur}
          className={addressError ? 'isError' : ''}
        />
      </Box>
    </Box>
  );
};

export default ProposeSendNft;
