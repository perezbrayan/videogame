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
import { isAuthenticated } from '../../services/auth';
import GameForm from './GameForm';

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
      await deleteGame(selectedGame.game_id);
      setSuccessMessage('Juego eliminado exitosamente');
      fetchGames();
      setOpenDialog(false);
    } catch (err) {
      setError(err.message || 'Error al eliminar el juego');
      console.error('Error deleting game:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage('');
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
          src={`http://localhost:5000${params.value}`}
          alt={params.row.title}
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
              setSelectedGame(params.row);
              setOpenEditForm(true);
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
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={games}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.game_id}
        loading={loading}
        components={{
          Toolbar: GridToolbar,
        }}
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
        onClose={() => setOpenEditForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Juego</DialogTitle>
        <DialogContent>
          <GameForm
            initialData={selectedGame}
            onSubmit={async () => {
              await fetchGames();
              setOpenEditForm(false);
              setSuccessMessage('Juego actualizado exitosamente');
            }}
          />
        </DialogContent>
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
