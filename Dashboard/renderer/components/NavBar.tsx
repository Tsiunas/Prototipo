import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useRouter } from "next/router";
import { Analytics } from "@mui/icons-material";
import { useAtom } from "jotai";
import { sessionAtom } from "./rqAppi/atoms";
import { useQuery } from "react-query";
import { getSessions } from "./rqAppi/Api";
import Select from "@mui/material/Select";

const appName = "PlayInsight";
const pages = [
  { name: "home", route: "/home" },
  { name: "Seguimiento", route: "/start" },
  { name: "Progreso", route: "/progreso" },
  { name: "Tsiunas", route: "/tsiunas" },
  { name: "Sesiones", route: "/sessions" },
  { name: "Predicción del conocimiento", route: "/model" },
];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function ResponsiveAppBar() {
  const router = useRouter();
  const { data: sessions, isLoading } = useQuery("sessions", getSessions);
  const [session, setSession] = useAtom(sessionAtom);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleSelectSession = (event) => {
    const sessionId = event.target.value;

    setSession({
      ...session,
      ...sessions?.filter((s) => s.idsession === sessionId)[0],
      duracion: secondsToHHMMSS(
        parseInt(
          sessions?.filter((s) => s.idsession === sessionId)[0]
            .duracion_segundos
        )
      ),

      idsession: sessionId,
    });
  };
  React.useEffect(() => {
    if (session.idsession === -1 && sessions) {
      setSession({
        ...session,
        ...sessions[0],
        idsession: sessions[0].sessionId,
        duracion: secondsToHHMMSS(parseInt(sessions[0].duracion_segundos)),
      });
    }
  }, [session]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src="/images/logo.png" width="60" height="60" />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {appName}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={() => router.push(page.route)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Analytics sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {appName}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <Button
                key={index}
                onClick={() => router.push(page.route)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
            <Box sx={{ display: { xs: "block", md: "none" } }}></Box>
          </Box>
          <Select
            value={session.idsession}
            onChange={handleSelectSession}
            sx={{
              color: "white",
              "& .MuiSelect-select": {
                borderColor: "white",
              },
            }}
            renderValue={(value) => (
              <Typography sx={{ color: "white" }}>
                {value === -1 ? "Sesión actual" : value}
              </Typography>
            )}
          >
            <MenuItem key={-1} value={-1}>
              Sesión actual
            </MenuItem>
            {sessions?.map((session) => (
              <MenuItem key={session.idsession} value={session.idsession}>
                {session.idsession} {"|  " + session.inicio}
              </MenuItem>
            ))}
          </Select>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function secondsToHHMMSS(sec) {
  // Calcular las horas, minutos y segundos
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec % 3600) / 60);
  let seconds = Math.floor(sec % 60);

  // Añadir ceros a la izquierda si es necesario
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  // Devolver la cadena con el formato hh:mm:ss
  return hours + ":" + minutes + ":" + seconds;
}
export default ResponsiveAppBar;
