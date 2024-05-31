import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectedTemplateForSavingSelector } from 'src/redux/selectors/modalsSelector';

export const useGetSelectedTemplate = () => {
  const template = useSelector(selectedTemplateForSavingSelector);

  return useMemo(
    () => ({
      template,
    }),
    [template],
  );
};
