import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectedTemplateToSendSelector } from 'src/redux/selectors/modalsSelector';

export const useGetSelectedTemplate = () => {
  const template = useSelector(selectedTemplateToSendSelector);

  return useMemo(
    () => ({
      template,
    }),
    [template],
  );
};
