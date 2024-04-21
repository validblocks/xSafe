import { Box } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import * as Styled from 'src/components/Utils/styled';
import { StyledSelect } from 'src/components/MultisigDetails/styled';
import { Text } from '../StyledComponents/StyledComponents';

interface ICustomSelectOption<TValue> {
  displayValue: string;
  value: TValue;
  key?: string;
}

interface ICustomSelectProps<TValue> {
  label?: string;
  options: ICustomSelectOption<TValue>[];
  handleSelectionChanged?: (
    e: React.ChangeEvent<HTMLSelectElement>,
    value: ICustomSelectOption<TValue> | null,
  ) => void;
}

function CustomSelect<TValue extends string>({
  label,
  options,
  handleSelectionChanged,
}: ICustomSelectProps<TValue>) {
  const [option, setOption] =
    React.useState<ICustomSelectOption<TValue> | null>(options?.[0]);
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);

  const onSelectionChanged = useCallback(
    (
      e: React.ChangeEvent<HTMLSelectElement>,
      newValue: { props: { value: TValue } },
    ) => {
      if (!newValue) return;

      const option = options.find(
        (o) => o.displayValue === newValue.props.value,
      );

      if (!option) return;

      handleSelectionChanged?.(e, option);

      setOption(option);
    },
    [handleSelectionChanged, options],
  );

  const selectMenuProps = useMemo(
    () => ({
      sx: {
        '&&&': {
          '& .MuiPaper-root > ul': {
            padding: '8px 0',
            backgroundColor: isDarkThemeEnabled ? '#1E1D2A' : '#fff',
          },
          '& .MuiPaper-root': {
            marginTop: '2px',
            backgroundColor: 'transparent',
          },
        },
      },
    }),
    [isDarkThemeEnabled],
  );

  const themePrimaryBoxStyles = useMemo(
    () => ({
      '& > img': {
        m: '5px 10px 0 0',
        flexShrink: 0,
        borderRadius: '2px',
      },
    }),
    [],
  );

  return (
    <Box>
      <StyledSelect
        value={option?.displayValue}
        sx={{ width: 250 }}
        label={label}
        MenuProps={selectMenuProps}
        onChange={onSelectionChanged}
        data-testid="custom-select"
      >
        {options?.map((option, idx) => (
          <Styled.ThemePrimaryMenuItem
            key={option?.key ?? option.value}
            value={option.displayValue}
          >
            <Styled.ThemePrimaryBox display="flex" sx={themePrimaryBoxStyles}>
              <Text data-testid={`custom-select-option-${idx}`}>
                {option.displayValue}
              </Text>
            </Styled.ThemePrimaryBox>
          </Styled.ThemePrimaryMenuItem>
        ))}
      </StyledSelect>
    </Box>
  );
}

export default CustomSelect;
