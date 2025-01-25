import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
  Alert,
  Fade,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';


const GameForm = ({ onClose, initialData = null, onSubmit }) => {
  // Validación de props al inicio del componente
  if (typeof onSubmit !== 'function') {
    console.error('GameForm: onSubmit debe ser una función, recibido:', onSubmit);
  }
  if (typeof onClose !== 'function') {
    console.error('GameForm: onClose debe ser una función, recibido:', onClose);
  }

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    developer_name: '',
    release_date: '',
    base_price: '',
    stock: '',
    image: null,
    discount_percentage: 0,
    platform: 'pc'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        developer_name: initialData.developer_name || '',
        release_date: initialData.release_date ? initialData.release_date.split('T')[0] : '',
        base_price: initialData.base_price || '',
        stock: initialData.stock || '',
        discount_percentage: initialData.discount_percentage || 0,
        platform: initialData.platform || 'pc',
        image: null // La imagen se maneja de forma especial
      });

      // Si hay una imagen existente, mostrar la preview
      if (initialData.image_url) {
        setImagePreview(`http://localhost:5000/uploads/games/${initialData.image_url}`);
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
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Token encontrado:', !!token);
      
      if (!token) {
        setError('No se encontró token de autenticación. Por favor, inicie sesión nuevamente.');
        setSuccess(false);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const formDataToSend = new FormData();
      
      // Agregar todos los campos al FormData
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Log para debug
      console.log('Datos a enviar:', Object.fromEntries(formDataToSend));

      if (typeof onSubmit !== 'function') {
        throw new Error('onSubmit prop no es una función válida');
      }
      
      await onSubmit(formDataToSend);
      
      setSuccess(true);
      setError(null);
      
      setTimeout(() => {
        if (typeof onClose === 'function') {
          onClose();
        }
      }, 1500);
    } catch (err) {
      console.error('Error al guardar el juego:', err);
      setSuccess(false);
      
      if (err.response?.status === 401) {
        setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(err.message || err.response?.data?.message || 'Error al guardar el juego');
      }
    }
  };




  return (
    <Fade in={true}>
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={onClose} color="primary">
                <BackIcon />
              </IconButton>
              <Typography variant="h5" component="h2">
                {initialData ? 'Editar Juego' : 'Nuevo Juego'}
              </Typography>
            </Stack>
            <IconButton onClick={onClose} color="default">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Juego creado exitosamente
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Título del Juego"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descripción"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="platform-label">Plataforma</InputLabel>
                      <Select
                        labelId="platform-label"
                        name="platform"
                        value={formData.platform}
                        label="Plataforma"
                        onChange={handleChange}
                      >
                        <MenuItem value="ps5">PlayStation 5</MenuItem>
                        <MenuItem value="xbox">Xbox Series X</MenuItem>
                        <MenuItem value="pc">PC</MenuItem>
                        <MenuItem value="switch">Nintendo Switch</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Precio Base"
                      name="base_price"
                      type="number"
                      value={formData.base_price}
                      onChange={handleChange}
                      required
                      inputProps={{ 
                        min: "0",
                        step: "0.01"
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Porcentaje de Descuento"
                      name="discount_percentage"
                      type="number"
                      value={formData.discount_percentage}
                      onChange={handleChange}
                      inputProps={{ 
                        min: "0",
                        max: "100",
                        step: "1"
                      }}
                      helperText={
                        formData.base_price && formData.discount_percentage > 0 
                          ? `Precio final: $${(formData.base_price * (1 - formData.discount_percentage / 100)).toFixed(2)}`
                          : "Sin descuento"
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Fecha de Lanzamiento"
                      name="release_date"
                      type="date"
                      value={formData.release_date}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Desarrollador"
                      name="developer_name"
                      value={formData.developer_name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'background.default',
                    borderStyle: 'dashed'
                  }}
                >
                  {imagePreview ? (
                    <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: 8,
                          maxHeight: 200,
                          objectFit: 'cover'
                        }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.7)'
                          }
                        }}
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                      >
                        <CloseIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography color="textSecondary" sx={{ mb: 2 }}>
                      Imagen del Juego
                    </Typography>
                  )}
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    sx={{ mt: 1 }}
                  >
                    Subir Imagen
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                startIcon={<CloseIcon />}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                {initialData ? 'Guardar Cambios' : 'Crear Juego'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

GameForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default GameForm;
