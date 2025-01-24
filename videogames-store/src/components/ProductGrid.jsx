import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Chip,
  IconButton,
  Rating,
  Stack
} from '@mui/material';
import { 
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  LocalOffer as OfferIcon,
  SportsEsports as PlatformIcon
} from '@mui/icons-material';
import axios from 'axios';

const ProductGrid = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        width: '100%',
        p: { xs: 2, sm: 4, md: 6 },
        bgcolor: '#f5f5f5'
      }}>
        <Typography variant="h5" sx={{ mt: 4 }}>
          Cargando juegos...
        </Typography>
      </Box>
    );
  }

  if (games.length === 0) {
    return (
      <Box sx={{ 
        width: '100%',
        p: { xs: 2, sm: 4, md: 6 },
        bgcolor: '#f5f5f5'
      }}>
        <Typography variant="h5" sx={{ mt: 4 }}>
          No hay juegos disponibles. Agrega algunos desde el panel de administración.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      p: { xs: 2, sm: 4, md: 6 },
      bgcolor: '#f5f5f5'
    }}>
      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={game.game_id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderRadius: 4,
                overflow: 'hidden',
                bgcolor: 'background.paper',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                }
              }}
            >
              {/* Discount Badge */}
              {game.discount && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                    bgcolor: 'error.main',
                    color: 'white',
                    py: 0.5,
                    px: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  <OfferIcon sx={{ fontSize: '1rem' }} />
                  -{game.discount}%
                </Box>
              )}

              {/* Game Image */}
              <Box sx={{ position: 'relative', pt: '60%' }}>
                <CardMedia
                  component="img"
                  image={game.image_url ? `http://localhost:5000${game.image_url}` : 'https://via.placeholder.com/300x400'}
                  alt={game.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              {/* Content */}
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Stack spacing={2}>
                  {/* Title */}
                  <Typography 
                    variant="h6" 
                    component="h2"
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      lineHeight: 1.2,
                      mb: 1
                    }}
                  >
                    {game.title}
                  </Typography>

                  {/* Platform & Category */}
                  <Stack direction="row" spacing={1}>
                    <Chip 
                      icon={<PlatformIcon />} 
                      label={game.platform}
                      size="small"
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        '& .MuiChip-icon': { color: 'white' }
                      }}
                    />
                    <Chip 
                      label={game.category}
                      size="small"
                      sx={{ bgcolor: 'secondary.light' }}
                    />
                  </Stack>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating 
                      value={game.rating} 
                      precision={0.5} 
                      size="small" 
                      readOnly 
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {game.rating}
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography 
                      variant="h6" 
                      color="primary"
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1.4rem'
                      }}
                    >
                      ${game.base_price}
                    </Typography>
                    {game.old_price && (
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ 
                          textDecoration: 'line-through',
                          fontSize: '1rem'
                        }}
                      >
                        ${game.old_price}
                      </Typography>
                    )}
                  </Box>

                  {/* Actions */}
                  <Stack 
                    direction="row" 
                    spacing={1}
                    sx={{ mt: 'auto' }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<CartIcon />}
                      fullWidth
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        py: 1,
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                    <IconButton 
                      sx={{ 
                        border: 1,
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'primary.main'
                        }
                      }}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;
