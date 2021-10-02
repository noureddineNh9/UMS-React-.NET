import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar } from '@material-ui/core';

const MainNavbar = (props) => (
  <AppBar
    elevation={0}
    {...props}
  >
    <Toolbar sx={{ height: 64 }}>
      <RouterLink to="/">
      <img
        alt="Logo"
        src="/static/logo.svg"
        {...props}
        />
      </RouterLink>
    </Toolbar>
  </AppBar>
);

export default MainNavbar;
