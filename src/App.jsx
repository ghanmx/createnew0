import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import MainPage from './pages/MainPage';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ChakraProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ChakraProvider>
    </ErrorBoundary>
  );
}

export default App;