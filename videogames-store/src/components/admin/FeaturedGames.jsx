import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  DragHandle as DragIcon
} from '@mui/icons-material';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const FeaturedGames = () => {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar juegos destacados y todos los juegos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredResponse, allGamesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/featured'),
          axios.get('http://localhost:5000/api/games')
        ]);
        setFeaturedGames(featuredResponse.data);
        setAllGames(allGamesResponse.data.games);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error al cargar los juegos');
      }
    };
    fetchData();
  }, []);

  // Guardar cambios en juegos destacados
  const handleSave = async () => {
    try {
      await axios.put('http://localhost:5000/api/featured', {
        featuredGames: featuredGames.map(game => game.game_id)
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('Juegos destacados actualizados exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving featured games:', error);
      setError('Error al guardar los juegos destacados');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Agregar juego a destacados
  const handleAddGame = (game) => {
    if (featuredGames.length >= 6) {
      setError('No puedes agregar más de 6 juegos destacados');
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!featuredGames.find(fg => fg.game_id === game.game_id)) {
      setFeaturedGames([...featuredGames, game]);
    }
    setOpenDialog(false);
  };

  // Remover juego de destacados
  const handleRemoveGame = (gameId) => {
    setFeaturedGames(featuredGames.filter(game => game.game_id !== gameId));
  };

  // Manejar el reordenamiento
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(featuredGames);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFeaturedGames(items);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/40x40?text=No+Image';
    return `http://localhost:5000${imageUrl}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Juegos Destacados
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ mb: 2, p: 2 }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="featured-games">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {featuredGames.map((game, index) => (
                  <Draggable 
                    key={game.game_id.toString()} 
                    draggableId={game.game_id.toString()} 
                    index={index}
                  >
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ 
                          bgcolor: 'background.paper',
                          mb: 1,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Box {...provided.dragHandleProps} sx={{ mr: 2 }}>
                          <DragIcon />
                        </Box>
                        <Avatar
                          src={getImageUrl(game.image_url)}
                          alt={game.title}
                          sx={{ mr: 2, width: 40, height: 40 }}
                        />
                        <ListItemText 
                          primary={game.title}
                          secondary={`${game.developer_name} - $${game.base_price}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={() => handleRemoveGame(game.game_id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            disabled={featuredGames.length >= 6}
          >
            Agregar Juego
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Guardar Cambios
          </Button>
        </Box>
      </Paper>

      {/* Diálogo para seleccionar juegos */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Seleccionar Juego</DialogTitle>
        <DialogContent>
          <List>
            {allGames
              .filter(game => !featuredGames.find(fg => fg.game_id === game.game_id))
              .map(game => (
                <ListItem 
                  key={game.game_id}
                  button
                  onClick={() => handleAddGame(game)}
                >
                  <Avatar
                    src={getImageUrl(game.image_url)}
                    alt={game.title}
                    sx={{ mr: 2 }}
                  />
                  <ListItemText 
                    primary={game.title}
                    secondary={`${game.developer_name} - $${game.base_price}`}
                  />
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeaturedGames;
