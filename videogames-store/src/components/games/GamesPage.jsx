import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/games');
        setGames(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Error al cargar los juegos');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Catálogo de Juegos
      </Typography>
      
      <Grid container spacing={4}>
        {games.map((game) => (
          <Grid item key={game.game_id} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:5000${game.image_url}`}
                alt={game.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {game.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {game.description.length > 100 
                    ? `${game.description.substring(0, 100)}...` 
                    : game.description}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  ${game.base_price}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    component={RouterLink}
                    to={`/games/${game.game_id}`}
                    variant="outlined"
                    size="small"
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={game.stock === 0}
                  >
                    {game.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GamesPage;
