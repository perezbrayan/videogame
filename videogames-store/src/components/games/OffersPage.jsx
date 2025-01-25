import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import GameCard from './GameCard';

const OffersPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGamesOnSale = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/games');
        // Filtrar solo los juegos que tienen descuento
        const gamesOnSale = response.data.games.filter(game => game.discount_percentage > 0);
        setGames(gamesOnSale);
        setError(null);
      } catch (err) {
        console.error('Error fetching games on sale:', err);
        setError('Error al cargar los juegos en oferta');
      } finally {
        setLoading(false);
      }
    };

    fetchGamesOnSale();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)',
        pt: 8,
        pb: 6
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: 'white',
            mb: 4,
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Juegos en Oferta
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : games.length === 0 ? (
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              textAlign: 'center',
              opacity: 0.8
            }}
          >
            No hay juegos en oferta en este momento
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {games.map((game) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={game.game_id}>
                <GameCard game={game} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default OffersPage; 