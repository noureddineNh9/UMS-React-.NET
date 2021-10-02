import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import SettingsIcon from '@material-ui/icons/Settings';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  Typography
} from '@material-ui/core';
import NavItem from '../Components/NavItem';
import UserContext from '../Context/UserContext';
import MultiNavItem from './multiNavItem';



const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith'
};

const items = [

  {
    href: '/StudentArea/Profile',
    icon: AccountCircleIcon,
    title: 'Profile'
  },
  {
    href: '/StudentArea/Emails',
    icon: EmailIcon,
    title: 'Emails'
  },
  {
    href: '/StudentArea/settings',
    icon: SettingsIcon,
    title: 'Settings'
  }
];

const StudentSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const userContext = useContext(UserContext); 
  const [modules, setModules] = useState([]);

  useEffect(() => {
    setModules(userContext.User.Info.modules)

  }, []);  
  
  
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        <Avatar
          component={RouterLink}
          src={userContext.User.imageSrc}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 64
          }}
          to="/app/account"
        />
        <Typography
          color="textPrimary"
          variant="h5"
        >
          {userContext.User.userName}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          <MultiNavItem 
            title ="modules"
            items={modules.map(item => ({
              title: item.name,
              href: "/StudentArea/module/2" + item.id
            }))}
            icon={MenuBookIcon}
          />
            
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

StudentSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

StudentSidebar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default StudentSidebar;
