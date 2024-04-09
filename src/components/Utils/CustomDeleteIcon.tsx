import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { useOrganizationInfoContext } from 'src/components/Providers/OrganizationInfoContextProvider';

export const CustomDeleteIcon = () => {
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  const { isInReadOnlyMode } = useOrganizationInfoContext();

  return (
    <DeleteIcon
      sx={{
        // eslint-disable-next-line no-nested-ternary
        color: isDarkThemeEnabled
          ? isInReadOnlyMode
            ? '#eeeeee8a'
            : '#4c2ffc'
          : '#08041D8a',
      }}
    />
  );
};
