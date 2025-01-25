import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Container,
  Grid,
  Paper,
  Card,
  Stack,
  IconButton,
  Avatar,
  CircularProgress,
  Link,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GameCard from './games/GameCard';
import axios from 'axios';
import {
  SportsEsports as GamepadIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  Gamepad as ConsoleIcon,
  Speed as SpeedIcon,
  Public as WorldIcon,
  Computer as PCIcon,
  Gamepad as NintendoIcon,
} from '@mui/icons-material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const features = [
  {
    icon: <GamepadIcon />,
    title: "Latest Releases",
    description: "Get access to the newest games as soon as they launch"
  },
  {
    icon: <StarIcon />,
    title: "Top Rated",
    description: "Explore our curated collection of highest-rated games"
  },
  {
    icon: <OfferIcon />,
    title: "Best Deals",
    description: "Find incredible discounts on your favorite titles"
  }
];

const PlatformCard = ({ icon: Icon, name, games, id }) => {
  const theme = useTheme();
  
  return (
    <RouterLink 
      to={`/games?platform=${id}`} 
      style={{ textDecoration: 'none' }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.9) 0%, rgba(30, 136, 229, 0.8) 100%)',
          borderRadius: 3,
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[10],
            background: 'linear-gradient(135deg, rgba(21, 101, 192, 1) 0%, rgba(30, 136, 229, 0.9) 100%)',
          }
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            p: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
          }}
        >
          <Icon sx={{ fontSize: 40, color: 'white' }} />
        </Box>
        <Typography
          variant="h5"
          component="h3"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 1
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 500
          }}
        >
          {games}
        </Typography>
      </Paper>
    </RouterLink>
  );
};

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [platformCounts, setPlatformCounts] = useState({
    ps5: 0,
    xbox: 0,
    pc: 0,
    switch: 0
  });

  useEffect(() => {
    const fetchPlatformCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        const games = response.data.games || [];
        
        // Contar juegos por plataforma
        const counts = games.reduce((acc, game) => {
          acc[game.platform] = (acc[game.platform] || 0) + 1;
          return acc;
        }, {});
        
        setPlatformCounts(counts);
      } catch (error) {
        console.error('Error fetching platform counts:', error);
      }
    };

    fetchPlatformCounts();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        if (response.data && Array.isArray(response.data)) {
          // Ordenar los juegos por fecha de lanzamiento o ID y tomar los más recientes
          const sortedGames = response.data.sort((a, b) => b.id - a.id);
          setGames(sortedGames.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to load games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/featured');
        setFeaturedGames(response.data);
      } catch (error) {
        console.error('Error fetching featured games:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/300x400?text=No+Image';
    
    // Si la URL ya comienza con http o https, usarla directamente
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Si la URL no comienza con /, agregarlo
    const formattedUrl = imageUrl.startsWith('/') ? imageUrl : '/uploads/games/' + imageUrl;
    
    return `http://localhost:5000${formattedUrl}`;
  };

  const platforms = [
    {
      icon: ConsoleIcon,
      name: "PlayStation",
      games: `${platformCounts.ps5 || 0} juegos`,
      id: "ps5"
    },
    {
      icon: ConsoleIcon,
      name: "Xbox",
      games: `${platformCounts.xbox || 0} juegos`,
      id: "xbox"
    },
    {
      icon: PCIcon,
      name: "Gaming PC",
      games: `${platformCounts.pc || 0} juegos`,
      id: "pc"
    },
    {
      icon: NintendoIcon,
      name: "Nintendo Switch",
      games: `${platformCounts.switch || 0} juegos`,
      id: "switch"
    }
  ];

  return (
    <Box 
      component="div"
      sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/imagenes/EA-Sports-FC25-Banner.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.85,
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
            zIndex: 1,
          }
        }}
      >
        <Container 
          maxWidth={false} 
          sx={{ 
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 2, sm: 4, md: 6 },
          }}
        >
          <Box sx={{ maxWidth: '600px' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 800,
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Level Up<br />
              Your<br />
              Gaming<br />
              Experience
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Discover the latest and greatest games at unbeatable prices
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/games"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '50px',
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976d2 30%, #1bacf3 90%)',
                },
              }}
            >
              Shop Now →
            </Button>

            {/* Feature Cards */}
            <Grid container spacing={2} sx={{ mt: 6 }}>
              <Grid item xs={12} sm={6} md={4} key="hero-latest">
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    color: 'white',
                  }}
                >
                  <Typography variant="h6">Latest Releases</Typography>
                  <Typography variant="body2">
                    Get access to the newest games as soon as they launch
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4} key="hero-top">
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    color: 'white',
                  }}
                >
                  <Typography variant="h6">Top Rated</Typography>
                  <Typography variant="body2">
                    Explore our curated collection of highest-rated games
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4} key="hero-deals">
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    color: 'white',
                  }}
                >
                  <Typography variant="h6">Best Deals</Typography>
                  <Typography variant="body2">
                    Find incredible discounts on your favorite titles
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: 6,
        background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
        }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4} key="latest-releases">
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  transition: 'all 0.3s ease-in-out',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <GamepadIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>Latest Releases</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Get instant access to the newest games right when they launch. Stay ahead of the curve with our day-one releases.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4} key="top-rated">
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  transition: 'all 0.3s ease-in-out',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <StarIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>Top Rated</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Discover our carefully curated collection of highest-rated games, handpicked by our gaming experts.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4} key="best-deals">
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  transition: 'all 0.3s ease-in-out',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <OfferIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>Best Deals</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Find incredible discounts on your favorite titles. New deals added every week!
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Games Section */}
      <Box sx={{ 
        py: 8,
        background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
        }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 6
          }}>
            <Typography
              component="h2"
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Featured Games
            </Typography>
            <Button
              component={RouterLink}
              to="/games"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                px: 3,
                py: 1,
                borderRadius: '50px'
              }}
            >
              View All Games
            </Button>
          </Box>

          {loadingFeatured ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          ) : featuredGames.length > 0 ? (
            <Grid container spacing={4} justifyContent="center">
              {featuredGames.map((game) => (
                <Grid item key={game.game_id} xs={12} sm={6} md={4} lg={3}>
                  <Box sx={{ maxWidth: 200, mx: 'auto' }}>
                    <GameCard game={game} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                textAlign: 'center',
                py: 4
              }}
            >
              No featured games available
            </Typography>
          )}
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ 
        py: 6,
        background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
        }
      }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={{ 
              mb: 6, 
              fontWeight: 'bold',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            What Our Discord Community Says
          </Typography>

          <Grid container spacing={4}>
            {/* Testimonio 1 */}
            <Grid item xs={12} md={4} key="testimonial-1">
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  backgroundColor: '#fff',
                  '&::before': {
                    content: '"\\201C"',
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontSize: '4rem',
                    color: 'primary.main',
                    opacity: 0.2,
                    fontFamily: 'serif',
                    lineHeight: 1
                  }
                }}
              >
                <Typography variant="body1" sx={{ mb: 3, pt: 3, px: 2, fontSize: '1.1rem', fontStyle: 'italic' }}>
                  "The best gaming store I've ever used! Their prices are unbeatable and the download speeds are amazing. Plus, their Discord community is super helpful!"
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', px: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>DG</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      DarkGamer2024
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Discord Moderator
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Testimonio 2 */}
            <Grid item xs={12} md={4} key="testimonial-2">
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  backgroundColor: '#fff',
                  '&::before': {
                    content: '"\\201C"',
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontSize: '4rem',
                    color: 'primary.main',
                    opacity: 0.2,
                    fontFamily: 'serif',
                    lineHeight: 1
                  }
                }}
              >
                <Typography variant="body1" sx={{ mb: 3, pt: 3, px: 2, fontSize: '1.1rem', fontStyle: 'italic' }}>
                  "I love how they always have the latest releases available right at launch. The pre-load feature is a game-changer. Never going back to other stores!"
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', px: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>EP</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      ElitePlayer
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verified Buyer
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Testimonio 3 */}
            <Grid item xs={12} md={4} key="testimonial-3">
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  backgroundColor: '#fff',
                  '&::before': {
                    content: '"\\201C"',
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontSize: '4rem',
                    color: 'primary.main',
                    opacity: 0.2,
                    fontFamily: 'serif',
                    lineHeight: 1
                  }
                }}
              >
                <Typography variant="body1" sx={{ mb: 3, pt: 3, px: 2, fontSize: '1.1rem', fontStyle: 'italic' }}>
                  "Their customer support is fantastic! Had an issue with a download and they resolved it within minutes through Discord. 10/10 would recommend!"
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', px: 2 }}>
                  <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>GQ</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      GameQueen
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Discord VIP Member
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Gaming Platforms Section */}
      <Box sx={{ 
        py: 6,
        background: 'linear-gradient(180deg, #0d47a1 0%, #1a237e 100%)',
        position: 'relative',
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
        }
      }}>
        <Container maxWidth="xl">
          <Typography 
            variant="h3" 
            textAlign="center" 
            fontWeight="bold" 
            mb={6}
          >
            Gaming Platforms
          </Typography>
          <Grid container spacing={4}>
            {platforms.map((platform) => (
              <Grid item xs={12} sm={6} md={3} key={platform.id}>
                <PlatformCard {...platform} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer"
        sx={{
          background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)',
          color: 'white',
          pt: 6,
          pb: 3,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* About */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                About Us
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Your ultimate destination for digital games. We offer the best prices, instant delivery, and a passionate gaming community.
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                <Link
                  component="a"
                  href="#"
                  color="inherit"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  <FacebookIcon />
                  <Typography variant="body2">Facebook</Typography>
                </Link>
                <Link
                  component="a"
                  href="#"
                  color="inherit"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  <TwitterIcon />
                  <Typography variant="body2">Twitter</Typography>
                </Link>
                <Link
                  component="a"
                  href="#"
                  color="inherit"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  <InstagramIcon />
                  <Typography variant="body2">Instagram</Typography>
                </Link>
                <Link
                  component="a"
                  href="#"
                  color="inherit"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  <ChatIcon />
                  <Typography variant="body2">Discord</Typography>
                </Link>
              </Stack>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                {['Home', 'Games', 'About', 'Contact', 'Support'].map((link) => (
                  <Link
                    key={link}
                    component={RouterLink}
                    to={`/${link.toLowerCase()}`}
                    sx={{
                      color: 'white',
                      opacity: 0.8,
                      textDecoration: 'none',
                      '&:hover': {
                        opacity: 1,
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Stack>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Contact Us
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    support@gamestore.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon sx={{ opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    123 Gaming Street, Digital City
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +1 234 567 890
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {/* Copyright */}
          <Box 
            sx={{ 
              borderTop: '1px solid rgba(255,255,255,0.1)',
              mt: 4,
              pt: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              &copy; {new Date().getFullYear()} Game Store. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
