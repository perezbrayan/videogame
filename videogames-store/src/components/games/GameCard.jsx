import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  IconButton,
  Chip,
  Stack,
  Fade
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/constants';
import { formatCurrency } from '../../utils/formatters';

const GameCard = ({ game }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/games/${game.game_id}`);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/345x194?text=No+Image';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
  };

  const hasDiscount = game.discount_percentage && game.discount_percentage > 0;
  const finalPrice = hasDiscount 
    ? game.base_price * (1 - game.discount_percentage / 100)
    : game.base_price;

  return (
    <Fade in={true}>
      <Card
        sx={{
          width: '100%',
          maxWidth: 200,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-8px)',
            '& .game-platform': {
              transform: 'translateY(0) rotate(-3deg)',
              opacity: 1,
            }
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Discount Badge */}
        {hasDiscount && (
          <Box
            sx={{
              position: 'absolute',
              top: -10,
              left: -10,
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              zIndex: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              transform: 'rotate(-10deg)',
            }}
          >
            -{game.discount_percentage}% OFF
          </Box>
        )}

        {/* Platform Badge */}
        <Box
          className="game-platform"
          sx={{
            position: 'absolute',
            top: 15,
            right: -10,
            backgroundColor: '#2196f3',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            zIndex: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            transform: 'translateY(-20px) rotate(3deg)',
            opacity: 0,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          PS4
        </Box>

        {/* Game Image */}
        <Box sx={{ position: 'relative', pt: '100%' }}>
          <CardMedia
            component="img"
            image={getImageUrl(game.image_url)}
            alt={game.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px 12px 0 0',
            }}
          />
          {/* Hover Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <Stack direction="row" spacing={2}>
              <IconButton
                sx={{
                  bgcolor: '#2196f3',
                  '&:hover': { bgcolor: '#1976d2' },
                  color: 'white',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <CartIcon />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: '#ff4444',
                  '&:hover': { bgcolor: '#ff1744' },
                  color: 'white',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <FavoriteIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        <CardContent 
          sx={{ 
            flexGrow: 1, 
            p: 1,
            '&:last-child': { pb: 1 },
          }}
        >
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ 
              color: 'white',
              fontWeight: 'bold',
              mb: 0.5,
              fontSize: '0.875rem',
              lineHeight: 1.2,
              height: '2.4em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {game.title}
          </Typography>

          {/* Price Section */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            mt: 0.5
          }}>
            {hasDiscount ? (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'line-through',
                    fontSize: '0.75rem'
                  }}
                >
                  ${game.base_price}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#4caf50',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  ${finalPrice.toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                ${game.base_price}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default GameCard;
