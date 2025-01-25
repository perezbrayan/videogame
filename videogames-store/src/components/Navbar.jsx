import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const pages = [
  { name: 'Inicio', path: '/' },
  { name: 'Juegos', path: '/games' },
  { name: 'Ofertas', path: '/offers' },
];

const navStyles = {
  mainNav: {
    background: '#1976d2',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 1100,
  },
  logo: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '1.2rem',
    color: '#ffffff',
    textDecoration: 'none',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)',
    },
  },
  navLink: {
    color: '#ffffff !important',
    fontSize: '0.95rem',
    fontWeight: '500 !important',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    padding: '6px 16px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15) !important',
      transform: 'translateY(-2px)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '10%',
      width: '0%',
      height: '2px',
      backgroundColor: '#ffffff',
      transition: 'width 0.3s ease',
    },
    '&:hover::after': {
      width: '80%',
    },
  },
};

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ ...navStyles.mainNav, height: '100%' }}>
      <Typography
        variant="h6"
        component={RouterLink}
        to="/"
        sx={{
          ...navStyles.logo,
          p: 2,
          display: 'block',
          textAlign: 'center',
        }}
      >
        GAME STORE
      </Typography>
      <List>
        {pages.map((page) => (
          <ListItem key={page.name} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={page.path}
              sx={{
                ...navStyles.navLink,
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              <ListItemText 
                primary={page.name}
                primaryTypographyProps={{
                  style: {
                    fontWeight: 500,
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={navStyles.mainNav}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { sm: 'none' },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                ...navStyles.logo,
                mr: 2,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              GAME STORE
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  sx={navStyles.navLink}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            backgroundColor: 'transparent',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar />
    </Box>
  );
}

export default Navbar;
