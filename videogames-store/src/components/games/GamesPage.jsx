import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Pagination,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Stack,
  Button
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  SportsEsports as ConsoleIcon,
  Computer as PCIcon,
  Gamepad as NintendoIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import GameCard from './GameCard';
import { useLocation, useNavigate } from 'react-router-dom';

const platforms = [
  { id: 'all', name: 'Todas las plataformas', icon: <ConsoleIcon /> },
  { id: 'ps5', name: 'PlayStation 5', icon: <ConsoleIcon /> },
  { id: 'xbox', name: 'Xbox Series X', icon: <ConsoleIcon /> },
  { id: 'pc', name: 'PC', icon: <PCIcon /> },
  { id: 'switch', name: 'Nintendo Switch', icon: <NintendoIcon /> }
];

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [page, setPage] = useState(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [platform, setPlatform] = useState(searchParams.get('platform') || 'all');
  const [filteredGames, setFilteredGames] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Actualizar el estado de la plataforma cuando cambia la URL
    const platformParam = searchParams.get('platform');
    if (platformParam) {
      setPlatform(platformParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/games');
        // Actualizado para manejar la nueva estructura de respuesta
        setGames(response.data.games || []);
        setPagination(response.data.pagination || {
          total: 0,
          limit: 50,
          offset: 0
        });
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

  useEffect(() => {
    if (Array.isArray(games)) {
      setFilteredGames(
        games
          .filter(game => 
            (game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (platform === 'all' || game.platform === platform)
          )
          .sort((a, b) => {
            switch (sortBy) {
              case 'price-asc':
                return a.base_price - b.base_price;
              case 'price-desc':
                return b.base_price - a.base_price;
              case 'name':
                return a.title.localeCompare(b.title);
              default:
                return 0;
            }
          })
      );
    }
  }, [games, platform, searchTerm, sortBy]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlatformChange = (event) => {
    const newPlatform = event.target.value;
    setPlatform(newPlatform);
  };

  const pageCount = Math.ceil(filteredGames.length / pagination.limit);
  const displayedGames = filteredGames.slice(
    (page - 1) * pagination.limit,
    page * pagination.limit
  );

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (games.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6" color="text.secondary">
          No hay juegos disponibles para esta plataforma
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setPlatform('all')}
        >
          Ver todos los juegos
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        margin: 0,
        padding: 0,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        overflowX: 'hidden',
        paddingTop: '80px',
      }}
    >
      <Container 
        disableGutters
        maxWidth={false}
        sx={{ 
          margin: 0,
          padding: 0,
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        {/* Header Section */}
        <Box sx={{ 
          mb: 6, 
          textAlign: 'center',
          pt: { xs: 2, sm: 3 }
        }}>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              mb: 2
            }}
          >
            Discover Amazing Games
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 4
            }}
          >
            Explore our collection of the best video games
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 4,
            px: { xs: 1, sm: 2 },
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search games..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
              sx: {
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              },
            }}
            sx={{ flex: 1 }}
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel 
              id="sort-select-label"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: 'primary.main',
                }
              }}
            >
              Sort by
            </InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortBy}
              label="Sort by"
              onChange={handleSortChange}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            >
              <MenuItem value="popularity">Popularity</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="name">Name</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Platform Filter Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 4,
            px: { xs: 1, sm: 2 },
          }}
        >
          <FormControl sx={{ minWidth: 200, mb: 3 }}>
            <InputLabel id="platform-select-label">Plataforma</InputLabel>
            <Select
              labelId="platform-select-label"
              value={platform}
              label="Plataforma"
              onChange={handlePlatformChange}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            >
              <MenuItem value="all">Todas las plataformas</MenuItem>
              <MenuItem value="ps5">PlayStation 5</MenuItem>
              <MenuItem value="xbox">Xbox Series X</MenuItem>
              <MenuItem value="pc">PC</MenuItem>
              <MenuItem value="switch">Nintendo Switch</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Games Grid */}
        <Grid 
          container 
          spacing={1}
          sx={{
            mb: 4,
            mx: 0,
            width: '100%',
            margin: '0 !important',
            padding: '0 !important',
          }}
        >
          {displayedGames.map((game) => (
            <Grid 
              item 
              xs={6}
              sm={4} 
              md={3} 
              lg={2} 
              key={game.game_id}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 0.5,
                margin: 0,
              }}
            >
              <GameCard game={game} />
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {pageCount > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 4
            }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default GamesPage;
