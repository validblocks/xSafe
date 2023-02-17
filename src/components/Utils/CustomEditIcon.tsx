import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';

export const CustomEditIcon = () => {
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  const { isInReadOnlyMode } = useOrganizationInfoContext();

  return (
    <EditIcon sx={{
      // eslint-disable-next-line no-nested-ternary
      color: isDarkThemeEnabled ? isInReadOnlyMode ? '#eeeeee8a' : '#4c2ffc' : '#08041D8a',
    }}
    />
  );
};
