import React, { useEffect, useState } from 'react';
import { Box, Link, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { logout } from '../utils/accountUtils';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          setIsAuthenticated(true);
          setUserRole(decoded.role);
        } else {
          localStorage.removeItem('jwt_token');
        }
      } catch (err) {
        localStorage.removeItem('jwt_token');
      }
    }
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      width="100vw"
      height="5rem"
      position="fixed"
      top={0}
      left={0}
      display="flex"
      px={10}
      sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >

      <Box height="100%" width="25%" display="flex" alignItems="center">
        <img
          src="/assets/images/logo/navbar_logo.png"
          alt="THRIVE"
          style={{ height: '50%' }}
        />
      </Box>

      <Box
        width="50%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={3}
      >
        <Link href="/" underline="none" className="navBarLinks">Home</Link>
        <Link href="/contact" underline="none" className="navBarLinks">Contact</Link>
      </Box>

      <Box
        height="100%"
        width="25%"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        gap={2}
      >
        {isAuthenticated ? (
          <>
            {userRole === 'admin' ? (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <MenuIcon sx={{ color: '#fff' }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Link href="/admin" underline="none" color="inherit">Admin Panel</Link>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Link href="/user/userHome" underline="none" color="inherit">Thrive App</Link>
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); logout(); }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  href="/user/userHome"
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    },
                  }}
                >
                  Thrive App
                </Button>
                <Button onClick={logout} sx={{ color: '#fff', textTransform: 'none' }}>
                  Logout
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Link href="/register" underline="none" className="navBarLinks">Register</Link>
            <Button
              href="/login"
              variant="contained"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '8px',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                },
              }}
            >
              Log In
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
