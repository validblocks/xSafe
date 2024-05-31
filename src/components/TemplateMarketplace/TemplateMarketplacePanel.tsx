import TemplateCard from './TemplateCard';
import { Button, ButtonGroup, Grid, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useCustomTheme } from 'src/hooks/useCustomTheme';
import { useTemplates } from 'src/hooks/useTemplates';
import { TemplateType } from '../Modals/Templates/SaveTemplateModalContent';
import { useSelector } from 'react-redux';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import NoActionsOverlay from '../Utils/NoActionsOverlay';

export const TemplateMarketplacePanel = () => {
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const theme = useCustomTheme();
  const currentContract = useSelector(currentMultisigContractSelector);

  const [selectedType, setSelectedType] = useState<TemplateType | undefined>(
    TemplateType.Personal,
  );

  const { data: templates } = useTemplates({
    type: selectedType,
    ownerAddress:
      selectedType === TemplateType.Organization
        ? currentContract?.address
        : undefined,
  });

  return (
    <Box pb={6}>
      <Box mb={2}>
        <ButtonGroup
          fullWidth={maxWidth600}
          variant="outlined"
          aria-label="Basic button group"
          sx={{
            border: `1px solid ${theme.palette.divider.tabs}`,
            color: theme.palette.text.primary,
          }}
        >
          {Object.values(TemplateType).map((type) => (
            <Button
              key={type}
              onClick={() => setSelectedType(type)}
              sx={{
                border: 'none',
                backgroundColor:
                  selectedType === type
                    ? theme.palette.background.main
                    : theme.palette.background.default,
                color:
                  selectedType === type
                    ? theme.palette.text.primary
                    : theme.palette.text.secondaryMenu,
                '&:hover': {
                  border: 'none',
                  backgroundColor:
                    selectedType === type
                      ? theme.palette.background.main
                      : theme.palette.background.default,
                  color:
                    selectedType === type
                      ? theme.palette.text.primary
                      : theme.palette.text.secondaryMenu,
                },
              }}
            >
              {type}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      {templates?.length === 0 ? (
        <Grid container margin={0}>
          <Grid xs={12} item>
            <NoActionsOverlay message={'No templates available'} />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {templates?.map((template, idx) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              maxWidth={maxWidth600 ? '100% !important' : '380px !important'}
              key={idx}
            >
              <TemplateCard {...template} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
