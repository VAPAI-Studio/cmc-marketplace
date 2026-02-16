import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Library } from './pages/Library';
import { Dashboard } from './pages/Dashboard';

function App() {
  // TODO: Implement proper auth state management with Supabase
  const isAuthenticated = false;
  const userRole = undefined;

  const handleLogout = () => {
    // TODO: Implement Supabase logout
    console.log('Logout');
  };

  return (
    <BrowserRouter>
      <Layout
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onLogout={handleLogout}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/library" element={<Library />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
