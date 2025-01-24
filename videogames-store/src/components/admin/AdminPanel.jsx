import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button
} from '@mui/material';
import GamesList from './GamesList';
import GameForm from './GameForm';
import LoginForm from './LoginForm';
import { isAuthenticated, logout } from '../../services/auth';

const AdminPanel = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si hay un token válido al cargar
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Panel de Administración
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleLogout}
        >
          Cerrar Sesión
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Lista de Juegos" />
          <Tab label="Agregar Juego" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {currentTab === 0 && <GamesList />}
        {currentTab === 1 && <GameForm onSubmit={() => setCurrentTab(0)} />}
      </Box>
    </Container>
  );
};

export default AdminPanel;
