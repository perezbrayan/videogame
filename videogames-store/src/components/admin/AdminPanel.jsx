import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  IconButton,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Games as GamesIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
} from '@mui/icons-material';
import GamesList from './GamesList';
import GameForm from './GameForm';

const AdminPanel = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [showAddGame, setShowAddGame] = useState(false);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setShowAddGame(false);
  };

  const handleAddGame = () => {
    setShowAddGame(true);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
        pt: { xs: '64px', sm: '72px' },
        pb: 4
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              mb: 2
            }}
          >
            Panel de Administración
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              mb: 4
            }}
          >
            Gestiona tu tienda de videojuegos
          </Typography>
        </Box>

        {/* Main Content */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Tabs Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '1rem',
                }
              }}
            >
              <Tab
                icon={<DashboardIcon />}
                label="Dashboard"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab
                icon={<GamesIcon />}
                label="Juegos"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab
                icon={<OrdersIcon />}
                label="Órdenes"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab
                icon={<PeopleIcon />}
                label="Usuarios"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Box sx={{ p: 3 }}>
            {/* Dashboard Panel */}
            {currentTab === 0 && (
              <Fade in={currentTab === 0}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Dashboard
                  </Typography>
                  {/* Add dashboard content here */}
                </Box>
              </Fade>
            )}

            {/* Games Panel */}
            {currentTab === 1 && (
              <Fade in={currentTab === 1}>
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 3 
                  }}>
                    <Typography variant="h5">
                      Gestión de Juegos
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleAddGame}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3
                      }}
                    >
                      Agregar Juego
                    </Button>
                  </Box>
                  {showAddGame ? (
                    <GameForm onClose={() => setShowAddGame(false)} />
                  ) : (
                    <GamesList />
                  )}
                </Box>
              </Fade>
            )}

            {/* Orders Panel */}
            {currentTab === 2 && (
              <Fade in={currentTab === 2}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Órdenes
                  </Typography>
                  {/* Add orders content here */}
                </Box>
              </Fade>
            )}

            {/* Users Panel */}
            {currentTab === 3 && (
              <Fade in={currentTab === 3}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Usuarios
                  </Typography>
                  {/* Add users content here */}
                </Box>
              </Fade>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminPanel;
