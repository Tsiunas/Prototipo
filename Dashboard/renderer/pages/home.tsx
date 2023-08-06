import React, { useEffect } from "react";
import Head from "next/head";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Link from "../components/Link";

import { useInterval } from "react-use";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material";
import { useQuery } from "react-query";
import { getAlerts } from "../components/rqAppi/Api";

const Root = styled("div")(({ theme }) => {
  return {
    textAlign: "center",
    paddingTop: theme.spacing(4),
  };
});

function Home() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleClick = () => setOpen(true);

  const { enqueueSnackbar } = useSnackbar();

  // Aquí puedes agregar lógica adicional para obtener y mostrar los datos en el dashboard

  return (
    <>
      <Head>
        <title>Dashboard de seguimiento</title>
      </Head>
      <Root>
        <Typography variant="h4" gutterBottom>
          Dashboard de seguimiento
        </Typography>
        <Typography variant="h5" gutterBottom>
          ¡Bienvenido al prototipo de dashboard de seguimiento!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Esta es una herramienta en desarrollo para visualizar las métricas y
          analíticas de aprendizaje generadas a partir de las interacciones de
          los usuarios en el juego serio "Tsiunas".
        </Typography>
        <Typography variant="body1" gutterBottom>
          El objetivo de este dashboard es facilitar la comprensión del progreso
          y el rendimiento de los estudiantes durante las sesiones del juego
          serio, lo que permitirá a los educadores tomar decisiones informadas
          para mejorar la experiencia educativa.
        </Typography>
        <Typography gutterBottom>
          <Link href="/start">Iniciar con el seguimiento</Link>
        </Typography>
        <img src="/images/logo.png" />
      </Root>
    </>
  );
}

export default Home;
