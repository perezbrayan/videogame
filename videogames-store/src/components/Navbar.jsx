import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  InputBase,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { isAuthenticated, logout } from '../services/auth';

const pages = [
  { name: 'Inicio', path: '/' },
  { name: 'Juegos', path: '/games' },
  { name: 'Nuevos Lanzamientos', path: '/new' },
  { name: 'Ofertas', path: '/deals' },
  { name: 'Acerca de', path: '/about' }
];

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = isAuthenticated();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        VIDEOGAMES STORE
      </Typography>
      <List>
        {pages.map((page) => (
          <ListItem key={page.name} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={page.path}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
        {isLoggedIn && (
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/admin"
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary="Panel Admin" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1100
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: '70px',
            padding: '0 16px'
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out'
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
              mr: 3,
              display: { xs: 'none', sm: 'flex' },
              fontWeight: 800,
              fontSize: '1.5rem',
              letterSpacing: '0.5px',
              color: 'white',
              textDecoration: 'none',
              '&:hover': {
                color: 'white',
                transform: 'scale(1.02)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            VIDEOGAMES STORE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, gap: '8px' }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                sx={{ 
                  py: 1,
                  px: 2,
                  color: 'white', 
                  display: 'block',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {page.name}
              </Button>
            ))}

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              marginLeft: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '4px 8px',
              marginRight: '8px'
            }}>
              <InputBase
                placeholder="Buscar juegos..."
                sx={{
                  color: 'white',
                  '& input': {
                    padding: '4px 8px',
                    fontSize: '0.95rem',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1
                    }
                  },
                  width: '200px'
                }}
              />
              <IconButton 
                sx={{ 
                  color: 'white',
                  padding: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <SearchIcon />
              </IconButton>
            </Box>

            {isLoggedIn && (
              <Button
                component={RouterLink}
                to="/admin"
                sx={{ 
                  py: 1,
                  px: 2,
                  color: 'white', 
                  display: 'block',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  textTransform: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Panel Admin
              </Button>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn ? (
              <Tooltip title="Cerrar Sesión">
                <IconButton
                  onClick={handleLogout}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transform: 'rotate(90deg)',
                    },
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  }
                }}
              >
                Iniciar Sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
