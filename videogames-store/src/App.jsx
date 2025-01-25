import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Container } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/common/Navbar'
import HomePage from './components/HomePage'
import GamesPage from './components/games/GamesPage'
import GameDetails from './components/games/GameDetails'
import AdminPanel from './components/admin/AdminPanel'
import LoginPage from './components/auth/LoginPage'
import PrivateRoute from './components/auth/PrivateRoute'
import OffersPage from './components/games/OffersPage'
import RegisterPage from './components/auth/RegisterPage'

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          fontFamily: "'Outfit', sans-serif",
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
          overflowX: 'hidden',
        },
        body: {
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
          margin: 0,
          padding: 0,
          maxWidth: '100%',
          backgroundColor: '#f5f5f5'
        },
        '#root': {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          maxWidth: '100%',
          position: 'relative'
        }
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
          '& .MuiDataGrid-cell:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
          }
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }
      }
    }
  },
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: "'Outfit', sans-serif",
    h1: {
      fontWeight: 800,
      fontFamily: "'Outfit', sans-serif",
    },
    h2: {
      fontWeight: 700,
      fontFamily: "'Outfit', sans-serif",
      fontSize: {
        xs: '2.5rem',
        md: '3.75rem',
      },
    },
    h3: {
      fontWeight: 700,
      fontFamily: "'Outfit', sans-serif",
      fontSize: {
        xs: '2.2rem',
        md: '3rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontFamily: "'Outfit', sans-serif",
      fontSize: {
        xs: '1.8rem',
        md: '2.5rem',
      },
    },
    h5: {
      fontWeight: 500,
      fontFamily: "'Outfit', sans-serif",
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
      fontFamily: "'Outfit', sans-serif",
    },
    body1: {
      fontFamily: "'Outfit', sans-serif",
    },
    body2: {
      fontFamily: "'Outfit', sans-serif",
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            margin: 0,
            padding: 0,
            width: '100%',
            overflowX: 'hidden',
            backgroundColor: theme.palette.background.default
          }}>
            <Navbar />
            <Container 
              sx={{ 
                flexGrow: 1,
                padding: 0,
                margin: 0,
                maxWidth: '100% !important',
                width: '100%',
              }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/games/:id" element={<GameDetails />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/admin/*" 
                  element={
                    <PrivateRoute>
                      <AdminPanel />
                    </PrivateRoute>
                  } 
                />
                {/* Redirigir rutas no encontradas al inicio */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Container>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
