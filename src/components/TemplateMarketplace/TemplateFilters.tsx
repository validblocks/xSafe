import { Button, ButtonGroup } from '@mui/material';
import { TemplateType } from '../Modals/Templates/SaveTemplateModalContent';
import { useState } from 'react';
import { useCustomTheme } from 'src/hooks/useCustomTheme';

export const TemplateFilters = () => {
  const theme = useCustomTheme();
  const [selectedType, setSelectedType] = useState(TemplateType.Personal);

  return (
    <ButtonGroup
      variant="outlined"
      aria-label="Basic button group"
      //   sx={{
      //     '& .MuiButton-root': {
      //       border: `1px solid ${theme.palette.borders.secondary}`,
      //       color: theme.palette.text.primary,
      //     },
      //   }}
    >
      {Object.values(TemplateType).map((type) => (
        <Button
          key={type}
          onClick={() => setSelectedType(type)}
          sx={{
            border: `1px solid ${theme.palette.divider.tabs}`,
            backgroundColor:
              selectedType === type
                ? theme.palette.background.main
                : theme.palette.background.default,
            color:
              selectedType === type
                ? theme.palette.text.primary
                : theme.palette.text.secondaryMenu,
          }}
        >
          {type}
        </Button>
      ))}
    </ButtonGroup>
  );
};
