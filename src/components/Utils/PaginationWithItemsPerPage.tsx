import { memo, useEffect } from 'react';
import {
  Box,
  FormControl,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CenteredBox } from 'src/components/StyledComponents/StyledComponents';
import { StyledPagination, PaginationSelect } from 'src/components/Theme/StyledComponents';

type Props = {
  data: any;
  setParentItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setParentCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setParentDataForCurrentPage: React.Dispatch<React.SetStateAction<any>>;
  setParentTotalPages: React.Dispatch<React.SetStateAction<any>>;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
};

const PaginationWithItemsPerPage = memo(({
  data,
  setParentItemsPerPage,
  setParentCurrentPage,
  setParentDataForCurrentPage,
  setParentTotalPages,
  currentPage,
  itemsPerPage,
  totalPages,
}: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!data) return;

    const lastIndexOfCurrentPage = currentPage * itemsPerPage;
    const firstIndexOfCurrentpage = lastIndexOfCurrentPage - itemsPerPage;
    const currentData = data.slice(
      firstIndexOfCurrentpage,
      lastIndexOfCurrentPage,
    );

    setParentDataForCurrentPage(currentData);
  }, [data, currentPage, itemsPerPage, setParentDataForCurrentPage],
  );

  useEffect(() => {
    if (!data) return;
    setParentTotalPages(Math.ceil(data.length / itemsPerPage));
  }, [data, itemsPerPage, setParentTotalPages]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setParentCurrentPage(value);
  };

  const handleChangeOnActionsPerPage = (event: SelectChangeEvent) => {
    setParentCurrentPage(1);
    setParentItemsPerPage(Number(event.target.value));
  };

  return (
    <CenteredBox
      sx={{
        padding: '1rem 0',
        justifyContent: 'end !important',
        gap: '2rem',
      }}
    >
      <CenteredBox>
        <StyledPagination
          onChange={handleChange}
          count={totalPages}
          shape="rounded"
        />
      </CenteredBox>
      <CenteredBox sx={{ display: 'flex' }}>
        <Box>{t('Actions per page') as string}</Box>
        <FormControl sx={{ m: 1, minWidth: 50 }}>
          <PaginationSelect
            value={itemsPerPage.toString()}
            size="small"
            onChange={handleChangeOnActionsPerPage as any}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            input={<OutlinedInput />}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </PaginationSelect>
        </FormControl>
      </CenteredBox>
    </CenteredBox>
  );
});

export default PaginationWithItemsPerPage;
