/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from '@mui/material';
import * as Styled from './styled';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTemplateForCreationSelector } from 'src/redux/selectors/modalsSelector';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ModalTypes } from 'src/types/multisig/proposals/Proposals';
import { Address } from '@multiversx/sdk-core/out';

export const TransactionBuilderPageHeader = () => {
  const dispatch = useDispatch();

  const selectedTemplateForCreation = useSelector(
    selectedTemplateForCreationSelector,
  );

  const handleSaveAsTemplateButtonClick = useCallback(() => {
    dispatch(
      setProposeModalSelectedOption({ option: ModalTypes.create_template }),
    );
  }, [dispatch]);

  const isSaveAsTemplateButtonDisabled = useMemo(() => {
    console.log({ VALIDATION: selectedTemplateForCreation });
    return (
      !Address.isValid(selectedTemplateForCreation?.receiver ?? '') ||
      !selectedTemplateForCreation?.endpoint ||
      selectedTemplateForCreation?.value === undefined ||
      selectedTemplateForCreation?.value === null ||
      selectedTemplateForCreation?.value === ''
    );
  }, [selectedTemplateForCreation]);
  return (
    <>
      <Box pb={1} display="flex" gap={2}>
        <Styled.TxBuilderHeaderButton>
          Choose template
        </Styled.TxBuilderHeaderButton>
        <Styled.TxBuilderHeaderButton
          disabled={isSaveAsTemplateButtonDisabled}
          onClick={handleSaveAsTemplateButtonClick}
        >
          Save as template
        </Styled.TxBuilderHeaderButton>
      </Box>
    </>
  );
};
