
import Navbar from "../../components/NavBar"
import { Outlet } from 'react-router-dom';
import { Box } from "@mui/material"

export default function ClientLayout() {
    return (
        <>
            <Navbar />
            <Box className="content">
                <Outlet />
            </Box>
        </>
    )
}