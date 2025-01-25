import { useState, useEffect } from 'react';
import { setAuthToken } from '../../services/auth';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import GameForm from './GameForm';
import axios from 'axios';

const AdminDashboard = () => {
  const [games, setGames] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const getMultipartConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };
  };

  const fetchGames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/games', getAuthConfig());
      setGames(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Sesión expirada. Por favor, inicie sesión nuevamente.');
        // Redirect to login page or handle authentication error
      }
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleDelete = async (gameId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      try {
        await axios.delete(`http://localhost:5000/api/games/${gameId}`, getAuthConfig());
        fetchGames();
      } catch (error) {
        if (error.response?.status === 401) {
          alert('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
        console.error('Error deleting game:', error);
      }
    }
  };

  const handleEdit = (game) => {
    setSelectedGame(game);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedGame(null);
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGame(null);
    setIsEditing(false);
  };

  const handleFormSubmit = async (formData) => {
    if (!formData) {
      console.error('No se recibieron datos del formulario');
      throw new Error('No se recibieron datos del formulario');
    }

    try {
      const config = getMultipartConfig();
      console.log('Enviando datos con config:', config);
      console.log('FormData recibido:', Object.fromEntries(formData));

      let response;
      if (isEditing && selectedGame) {
        response = await axios.put(
          `http://localhost:5000/api/games/${selectedGame.game_id}`,
          formData,
          config
        );
        console.log('Respuesta de actualización:', response.data);
      } else {
        response = await axios.post(
          'http://localhost:5000/api/games',
          formData,
          config
        );
        console.log('Respuesta de creación:', response.data);
      }

      await fetchGames();
      handleCloseDialog();
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response?.status === 401) {
        alert('Sesión expirada. Por favor, inicie sesión nuevamente.');
      } else {
        alert(error.response?.data?.message || 'Error al procesar la solicitud');
      }
      throw error;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Panel de Administración
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Agregar Juego
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.game_id}>
                <TableCell>{game.title}</TableCell>
                <TableCell>${game.base_price}</TableCell>
                <TableCell>{game.stock}</TableCell>
                <TableCell>
                  {game.image_url && (
                    <img
                      src={`http://localhost:5000${game.image_url}`}
                      alt={game.title}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(game)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(game.game_id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { overflow: 'visible' }
        }}
      >
        <GameForm
          key={openDialog ? 'open' : 'closed'}
          initialData={selectedGame}
          onSubmit={handleFormSubmit}
          onClose={handleCloseDialog}
        />
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
