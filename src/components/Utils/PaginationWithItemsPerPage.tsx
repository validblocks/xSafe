import { useEffect } from 'react';
import {
  Box,
  FormControl,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CenteredBox } from 'src/components/StyledComponents/StyledComponents';

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

const PaginationWithItemsPerPage = ({
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
  }, [data, currentPage, itemsPerPage]);

  useEffect(() => {
    if (!data) return;
    setParentTotalPages(Math.ceil(data.length / itemsPerPage));
  }, [data, itemsPerPage]);

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
        justifyContent: 'start !important',
        gap: '2rem',
      }}
    >
      <CenteredBox>
        <Pagination
          onChange={handleChange}
          count={totalPages}
          shape="rounded"
        />
      </CenteredBox>
      <CenteredBox sx={{ display: 'flex' }}>
        <Box>{t('Actions per page') as string}</Box>
        <FormControl sx={{ m: 1, minWidth: 50 }}>
          <Select
            value={itemsPerPage.toString()}
            size="small"
            onChange={handleChangeOnActionsPerPage}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            input={<OutlinedInput />}
            sx={{ color: '#fff !important' }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
        </FormControl>
      </CenteredBox>
    </CenteredBox>
  );
};

export default PaginationWithItemsPerPage;
