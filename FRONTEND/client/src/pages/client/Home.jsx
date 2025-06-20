import { Box, Button, Typography } from '@mui/material';

export default function Home() {
    return (
        <Box
            sx={{
                position: 'relative',
                backgroundImage: 'url(/assets/images/home/home_background7.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    zIndex: 1,
                },
                zIndex: 0,
            }}
        >
            {/* Left Side */}
            <Box
                width="50%"
                height="100%"
                sx={{
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 4,
                }}
            >
                {/* Small Glass Box */}
                <Box
                    className="glass-card"
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        maxWidth: '90%',
                        width: '90%',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '2rem',
                            fontWeight: 600,
                            color: 'white',

                        }}
                    >
                        Passez en mode
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: '9rem',
                            fontWeight: 900,
                            color: 'white',
                            textShadow: `
  0 0 8px rgba(245, 235, 220, 0.35),
  0 0 16px rgba(245, 235, 220, 0.25),
  0 0 24px rgba(245, 235, 220, 0.2)
`,
                            mb: 0.5, // small spacing
                            lineHeight: 1.2,
                            ml: "-10px"
                        }}
                    >
                        FOCUS
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: '1.2rem',
                            fontWeight: 300,
                            mb: 3,
                            color: 'white',

                        }}
                    >
                        Avancez à votre rythme avec des sessions claires, des pauses réfléchies
                        et une interface pensée pour vous apaiser. Ici, la concentration devient
                        naturelle, et chaque tâche vous rapproche un peu plus de vos objectifs.
                    </Typography>

        <Button
          href="/login"
          variant="contained"
          size='large'
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
          Lancer une séance
        </Button>
                </Box>
            </Box>

            {/* Right Side (optional content) */}
            <Box width="50%" height="100%" />
        </Box>
    );
}
