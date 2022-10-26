import { CenteredBox } from 'src/components/StyledComponents/StyledComponents';
import { SettingsWrapper } from 'src/pages/Settings/settings-style';
import styled from 'styled-components';

export const HelpCenterWrapper = styled(CenteredBox)(({ theme: _ }) => ({
  width: '100%',
  height: '70vh',
  paddingTop: '10px',
}));

export const ComingSoonCardWrapper = styled(SettingsWrapper)(({ theme: _ }) => ({
  height: 180,
  width: 300,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 3,
}));
