import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar
} from '@mui/material';
import {
  DataGrid,
  GridToolbar
} from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { getGames, deleteGame } from '../../services/games';
import { isAuthenticated, setAuthToken } from '../../services/auth';
import GameForm from './GameForm';
import axios from 'axios';

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await getGames();
      setGames(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los juegos');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleDelete = async () => {
    if (!isAuthenticated()) {
      setError('Debes iniciar sesión para realizar esta acción');
      setOpenDialog(false);
      return;
    }

    try {
      // Asegurarnos de que el token está configurado
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
      }

      await axios.delete(`http://localhost:5000/api/games/${selectedGame.game_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      setSuccessMessage('Juego eliminado exitosamente');
      await fetchGames();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar el juego');
      console.error('Error deleting game:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage('');
  };

  const handleEdit = (game) => {
    setSelectedGame(game);
    setOpenEditForm(true);
  };

  const handleSubmit = async (formData, config) => {
    if (!isAuthenticated()) {
      setError('Debes iniciar sesión para realizar esta acción');
      return;
    }

    try {
      // Asegurarnos de que el token está configurado
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró el token de autenticación');
        return;
      }

      setAuthToken(token);

      if (selectedGame) {
        // Actualizar juego existente
        await axios.put(
          `http://localhost:5000/api/games/${selectedGame.game_id}`, 
          formData,
          config
        );
        setSuccessMessage('Juego actualizado exitosamente');
      } else {
        // Crear nuevo juego
        const response = await axios.post(
          'http://localhost:5000/api/games', 
          formData,
          config
        );
        console.log('Respuesta del servidor:', response.data);
        setSuccessMessage('Juego creado exitosamente');
      }
      
      // Recargar la lista de juegos
      await fetchGames();
      setOpenEditForm(false);
      setSelectedGame(null);
    } catch (err) {
      console.error('Error al procesar el juego:', err);
      setError(err.response?.data?.message || 'Error al procesar el juego');
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/40x40?text=No+Image';
    return `http://localhost:5000${imageUrl}`;
  };

  const columns = [
    { field: 'game_id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Título', width: 200 },
    { field: 'developer_name', headerName: 'Desarrollador', width: 150 },
    { field: 'release_date', headerName: 'Fecha de Lanzamiento', width: 150 },
    { field: 'base_price', headerName: 'Precio Base', width: 120 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    {
      field: 'image_url',
      headerName: 'Imagen',
      width: 130,
      renderCell: (params) => (
        <Box
          component="img"
          sx={{
            height: 40,
            width: 40,
            objectFit: 'cover',
            borderRadius: 1
          }}
          src={getImageUrl(params.value)}
          alt={params.row.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => {
              if (!isAuthenticated()) {
                setError('Debes iniciar sesión para editar juegos');
                return;
              }
              handleEdit(params.row);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => {
              if (!isAuthenticated()) {
                setError('Debes iniciar sesión para eliminar juegos');
                return;
              }
              setSelectedGame(params.row);
              setOpenDialog(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        overflow: 'hidden'
      }}
    >
      <DataGrid
        rows={games}
        columns={columns}
        getRowId={(row) => row.game_id}
        loading={loading}
        slots={{
          toolbar: GridToolbar,
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection={false}
        disableRowSelectionOnClick
      />

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el juego "{selectedGame?.title}"?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditForm}
        onClose={() => {
          setOpenEditForm(false);
          setSelectedGame(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <GameForm
          initialData={selectedGame}
          onClose={() => {
            setOpenEditForm(false);
            setSelectedGame(null);
          }}
          onSubmit={handleSubmit}
        />
      </Dialog>

      <Snackbar
        open={!!error || !!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: '100%' }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GamesList;
