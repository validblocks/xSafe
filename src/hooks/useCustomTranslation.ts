import { TFunction, useTranslation } from 'react-i18next';

export const useCustomTranslation = () => {
  const { t }: { t: TFunction } = useTranslation();

  return (translatableKey: string) => t(translatableKey).toString();
};
