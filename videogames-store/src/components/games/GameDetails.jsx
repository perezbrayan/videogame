import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/games/${id}`);
        setGame(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching game:', err);
        setError('Error al cargar los detalles del juego');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

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

  if (!game) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No se encontró el juego</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'contain',
                borderRadius: 1
              }}
              src={`http://localhost:5000${game.image_url}`}
              alt={game.title}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {game.title}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              ${game.base_price}
            </Typography>
            <Typography variant="body1" paragraph>
              {game.description}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Desarrollador: {game.developer_name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Fecha de lanzamiento: {new Date(game.release_date).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Stock disponible: {game.stock}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
              disabled={game.stock === 0}
            >
              {game.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default GameDetails;
