import { Box, Link, Button } from '@mui/material';

export default function Navbar() {
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
        background: 'rgba(255, 255, 255, 0.1)', // semi-transparent
        backdropFilter: 'blur(12px)',           // true glass effect
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Box
        height="100%"
        width="25%"
        display="flex"
        alignItems="center"
      >
        <img
          src="/assets/images/logo/navbar_logo.png"
          alt="THRIVE"
          style={{ height: '50%' }}
        />
      </Box>

      {/* Center Links */}
      <Box
        width="50%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={3}
      >
        <Link href="/" underline="none" className="navBarLinks">Home</Link>
        <Link href="/about" underline="none" className="navBarLinks">About</Link>
        <Link href="#" underline="none" className="navBarLinks">Services</Link>
        <Link href="/contact" underline="none" className="navBarLinks">Contact</Link>
      </Box>

      {/* Right Side Auth */}
      <Box
        height="100%"
        width="25%"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        gap={2}
      >
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
      </Box>
    </Box>
  );
}
