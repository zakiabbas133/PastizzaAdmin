import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './theme';
import { ToastProvider } from './components';
import { AuthProvider } from './context/AuthContext';
import { initializeFirestore } from './firebase/firestoreInit';
import AppRoutes from './pages/AppRoutes';

function App() {
  useEffect(() => {
    initializeFirestore()
      .catch((error) => {
        console.error("Firestore initialization failed:", error);
      });
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
