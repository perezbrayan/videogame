import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { createGame, updateGame } from '../../services/games';
import { isAuthenticated } from '../../services/auth';
import axios from 'axios';

const GameForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    developer_id: '',
    base_price: '',
    stock: '',
    image: null
  });
  const [developers, setDevelopers] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/developers');
        if (response.data && Array.isArray(response.data)) {
          setDevelopers(response.data);
        } else {
          throw new Error('Invalid developers data format');
        }
      } catch (error) {
        console.error('Error loading developers:', error);
        setError('Error al cargar los desarrolladores. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();

    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        developer_id: initialData.developer_id?.toString() || '',
        base_price: initialData.base_price || '',
        stock: initialData.stock || '',
      });
      if (initialData.image_url) {
        setPreviewUrl(`http://localhost:5000${initialData.image_url}`);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('La imagen es demasiado grande. El tamaño máximo es 5MB.');
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setError('Debes iniciar sesión para realizar esta acción');
      return;
    }

    if (!formData.developer_id) {
      setError('Por favor selecciona un desarrollador');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append('image', formData[key]);
        } else if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      if (initialData) {
        await updateGame(initialData.game_id, submitData);
      } else {
        await createGame(submitData);
      }

      if (onSubmit) {
        onSubmit();
      }

      // Limpiar el formulario si no es edición
      if (!initialData) {
        setFormData({
          title: '',
          description: '',
          developer_id: '',
          base_price: '',
          stock: '',
          image: null
        });
        setPreviewUrl('');
      }
    } catch (err) {
      console.error('Error submitting game:', err);
      setError(err.message || 'Error al guardar el juego. Por favor, intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Título"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            multiline
            rows={4}
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Desarrollador</InputLabel>
            <Select
              name="developer_id"
              value={formData.developer_id}
              onChange={handleChange}
              label="Desarrollador"
            >
              {developers.map((dev) => (
                <MenuItem key={dev.developer_id} value={dev.developer_id}>
                  {dev.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <TextField
            required
            fullWidth
            type="number"
            label="Precio Base"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            required
            fullWidth
            type="number"
            label="Stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
            fullWidth
          >
            Subir Imagen
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </Grid>

        {previewUrl && (
          <Grid item xs={12}>
            <Box
              component="img"
              sx={{
                width: '100%',
                maxHeight: 200,
                objectFit: 'contain'
              }}
              src={previewUrl}
              alt="Preview"
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : (initialData ? 'Actualizar' : 'Crear')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GameForm;
