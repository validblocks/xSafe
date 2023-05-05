import React, { useCallback, useEffect, useState } from 'react';
import GridViewIcon from 'src/assets/img/GridView.svg';
import GridViewIconActive from 'src/assets/img/GridViewActive.svg';
import ListViewIcon from 'src/assets/img/ListView.svg';
import ListViewIconActive from 'src/assets/img/ListViewActive.svg';
import { Box } from '@mui/material';
import GridIcon from './GridIcon';

interface IProps {
    setIsGroupedByCollection: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListGridViewSelection = ({ setIsGroupedByCollection }: IProps) => {
  const [isListView, setIsListView] = useState(true);
  const listViewClick = useCallback(() => {
    if (!isListView) setIsListView(true);
  }, [isListView]);

  const gridViewClick = useCallback(() => {
    if (isListView) setIsListView(false);
  }, [isListView]);

  useEffect(() => {
    setIsGroupedByCollection(isListView);
  }, [isListView, setIsGroupedByCollection]);
  return (
    <>
      <Box onClick={listViewClick}>
        <GridIcon svgUrl={isListView ? ListViewIconActive : ListViewIcon} />
      </Box>
      <Box onClick={gridViewClick}>
        <GridIcon svgUrl={!isListView ? GridViewIconActive : GridViewIcon} />
      </Box>
    </>
  );
};

export default ListGridViewSelection;
