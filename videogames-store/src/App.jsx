import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Container } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import GamesPage from './components/games/GamesPage'
import GameDetails from './components/games/GameDetails'
import AdminPanel from './components/admin/AdminPanel'
import LoginPage from './components/auth/LoginPage'
import PrivateRoute from './components/auth/PrivateRoute'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
      fontSize: {
        xs: '2.5rem',
        md: '3.75rem',
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: {
        xs: '2.2rem',
        md: '3rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: {
        xs: '1.8rem',
        md: '2.5rem',
      },
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        html: {
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
        },
        body: {
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
          margin: 0,
          padding: 0,
          maxWidth: '100%',
        },
        '#root': {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          maxWidth: '100%',
        }
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
        },
      },
    },
  },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/:id" element={<GameDetails />} />
            <Route path="/login" element={<LoginPage />} />
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
      </ThemeProvider>
    </Router>
  )
}

export default App
