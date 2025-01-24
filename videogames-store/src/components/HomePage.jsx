import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Stack,
  Container,
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  SportsEsports as GamepadIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  Gamepad as ConsoleIcon,
  Speed as SpeedIcon,
  Public as WorldIcon,
} from '@mui/icons-material';

const featuredGames = [
  {
    id: 1,
    title: "Call of Duty: Modern Warfare III",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=500",
    price: "$59.99",
    category: "Action",
  },
  {
    id: 2,
    title: "FIFA 24",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=500",
    price: "$49.99",
    category: "Sports",
  },
  {
    id: 3,
    title: "Spider-Man 2",
    image: "https://images.unsplash.com/photo-1616249807402-9dae436108cf?auto=format&fit=crop&w=500",
    price: "$69.99",
    category: "Adventure",
  }
];

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

const platforms = [
  {
    icon: <ConsoleIcon />,
    name: "PlayStation 5",
    games: "2,500+ games"
  },
  {
    icon: <ConsoleIcon />,
    name: "Xbox Series X",
    games: "2,000+ games"
  },
  {
    icon: <SpeedIcon />,
    name: "Gaming PC",
    games: "10,000+ games"
  },
  {
    icon: <WorldIcon />,
    name: "Nintendo Switch",
    games: "3,000+ games"
  }
];

const HomePage = () => {
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
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
          padding: 0
        }}
      >
        <Container maxWidth={false} sx={{ 
          height: '100%', 
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          mt: { xs: '64px', sm: '70px' }
        }}>
          <Grid 
            container 
            spacing={4}
            alignItems="center"
            sx={{ 
              width: '100%',
              margin: 0,
              height: 'auto'
            }}
          >
            {/* Hero Content - Left Side */}
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '5rem' }, 
                    fontWeight: 800, 
                    lineHeight: 1.1,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    mb: 3
                  }}
                >
                  Level Up<br />Your<br />Gaming<br />Experience
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, 
                    opacity: 0.9,
                    mb: 4
                  }}
                >
                  Discover the latest and greatest games at unbeatable prices
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: '#2196f3',
                    fontSize: '1.2rem',
                    py: 1.5,
                    px: 4,
                    borderRadius: '30px',
                    '&:hover': {
                      backgroundColor: '#1976d2'
                    }
                  }}
                >
                  Shop Now
                </Button>
              </Box>
            </Grid>
            
            {/* Hero Features - Right Side */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)'
                        }
                      }}
                    >
                      <Box sx={{ color: '#90caf9', mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container 
        maxWidth={false} 
        sx={{ 
          py: { xs: 6, md: 10 },
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          backgroundColor: 'white'
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  p: 4,
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    borderColor: 'primary.main'
                  }
                }}
              >
                <Stack spacing={3} alignItems="center" textAlign="center">
                  <IconButton 
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      p: 2,
                      transform: 'scale(1.2)',
                      boxShadow: '0 4px 12px rgba(33,150,243,0.3)',
                      '&:hover': { 
                        bgcolor: 'primary.dark',
                        transform: 'scale(1.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {feature.icon}
                  </IconButton>
                  <Typography variant="h5" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    {feature.description}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Games Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="xl">
          <Typography 
            variant="h3" 
            textAlign="center" 
            fontWeight="bold" 
            mb={6}
            sx={{
              background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Featured Games
          </Typography>
          <Grid container spacing={4}>
            {featuredGames.map((game) => (
              <Grid item xs={12} sm={6} md={4} key={game.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '56.25%' }}>
                    <Box
                      component="img"
                      src={game.image}
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
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {game.title}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography color="primary.main" fontWeight="bold">
                        {game.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {game.category}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Gaming Platforms Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          textAlign="center" 
          fontWeight="bold" 
          mb={6}
        >
          Gaming Platforms
        </Typography>
        <Grid container spacing={4}>
          {platforms.map((platform, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  p: 3,
                  borderRadius: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <IconButton 
                    sx={{ 
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      p: 2,
                      '&:hover': { bgcolor: 'primary.main', color: 'white' }
                    }}
                  >
                    {platform.icon}
                  </IconButton>
                  <Typography variant="h6" fontWeight="bold">
                    {platform.name}
                  </Typography>
                  <Typography color="text.secondary">
                    {platform.games}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Newsletter Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Stay Updated
          </Typography>
          <Typography variant="h6" mb={4} sx={{ opacity: 0.9 }}>
            Subscribe to our newsletter for the latest gaming news and exclusive offers
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: 'grey.100',
              }
            }}
          >
            Subscribe Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
