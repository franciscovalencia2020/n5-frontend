import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from '@components/SignUp';
import SignIn from '@components/SignIn';
import Navbar from '@components/Navbar';
import MyPermissions from '@components/MyPermissions';
import Users from '@components/Users';
import PermissionTypes from '@components/PermissionsType';
import UserPermissions from '@components/UserPermissions';
import Permissions from '@components/Permissions';
import './App.css';
import { JSX } from 'react';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/signin" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Box sx={{ height: '100vh', width: '100vw', background: 'linear-gradient(135deg, #003366, #1a1a1a)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SignUp />
            </Box>
          }
        />
        <Route
          path="/signin"
          element={
            <Box sx={{ height: '100vh', width: '100vw', background: 'linear-gradient(135deg, #003366, #1a1a1a)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SignIn />
            </Box>
          }
        />
        {['/my-permissions', '/user-permissions', '/users', '/permission-types', '/permissions'].map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <PrivateRoute>
                <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
                  <Box component={Navbar} sx={{ width: { xs: 200, sm: 240, md: 300 }, flexShrink: 0 }} />
                  <Box sx={{ flexGrow: 1, p: 3, height: '100vh', width: '100%', overflow: 'auto' }}>
                    {path === '/user-permissions' && <UserPermissions />}
                    {path === '/my-permissions' && <MyPermissions />}
                    {path === '/users' && <Users />}
                    {path === '/permission-types' && <PermissionTypes />}
                    {path === '/permissions' && <Permissions />}
                  </Box>
                </Box>
              </PrivateRoute>
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
