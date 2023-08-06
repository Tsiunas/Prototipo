import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Box, Grid, Paper, styled } from "@mui/material";
import { Button } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  closeSession,
  getReport,
  getSessions,
  getTraces,
  startSession,
} from "../components/rqAppi/Api";
import { ChartTracesVerb } from "../components/ChartTracesVerb";
import { ChartTracesActor } from "../components/ChartTracesActor";
import { height } from "@mui/system";
import TsiunasTable from "../components/TsiunasTable";
import FA from "../components/FA";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";

import { utils as XLSXUtils, writeFile } from "xlsx";

const Root = styled("div")(({ theme }) => {
  return {
    textAlign: "center",
    paddingTop: theme.spacing(0),
  };
});

const generarExcel = (datos, filename) => {
  const workbook = XLSXUtils.book_new();

  // Recorrer cada hoja en el JSON
  for (const hoja in datos) {
    if (datos.hasOwnProperty(hoja)) {
      const registros = datos[hoja];

      // Extraer los nombres de las claves como nombres de columna
      const columnas = Object.keys(registros[0]);

      // Convertir los registros en una matriz de datos
      const data = registros.map((registro) => {
        return columnas.map((columna) => registro[columna]);
      });

      // Crear una hoja y agregar los datos
      const worksheet = XLSXUtils.aoa_to_sheet([columnas, ...data], {
        skipHeader: true,
      });
      XLSXUtils.book_append_sheet(workbook, worksheet, hoja);
    }
  }

  // Generar el archivo de Excel y descargarlo
  writeFile(workbook, filename + ".xlsx");
};

const descargarExcel = (buffer, filename) => {
  const data = new Blob([buffer], { type: "application/octet-stream" });

  if (typeof window.navigator.msSaveBlob !== "undefined") {
    // Para IE y Edge
    window.navigator.msSaveBlob(data, filename);
  } else {
    // Para otros navegadores
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

function Home() {
  const queryClient = useQueryClient();
  const [idsession, setIdsession] = useState(-1);
  const { data: report, refetch } = useQuery("report", () => {
    return getReport(idsession);
  });
  useEffect(() => {
    if (idsession !== -1) {
      refetch();
    }
  }, [idsession]);
  useEffect(() => {
    if (idsession !== -1) {
      generarExcel(report, "Reporte sesión " + idsession);
    }
  }, [report]);
  const handleCloseSession = useMutation(closeSession, {
    onSuccess: () => {
      queryClient.invalidateQueries("sessions");
    },
  });

  const handleStartNewSessionM = useMutation(startSession, {
    onSuccess: () => {
      queryClient.invalidateQueries("sessions");
    },
  });
  const handleStartNewSession = async () => {
    // Verificar si hay sesiones abiertas
    const openSessions = data.filter((session) => session.final === null);

    if (openSessions.length > 0) {
      // Mostrar mensaje de error o tomar alguna acción apropiada
      Swal.fire({
        icon: "error",
        title: "No se puede iniciar una nueva sesión",
        text: "Hay sesiones abiertas",
      });

      return;
    }

    // No hay sesiones abiertas, iniciar una nueva sesión
    await handleStartNewSessionM.mutate();
  };

  const { data, isLoading } = useQuery("sessions", getSessions);

  const [windowSize, setWindowSize] = useState([0, 0]);

  useEffect(() => {
    function handleResize() {
      setWindowSize([window.innerWidth, window.innerHeight - 68.5]);
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <Head>
        <title>Gestión de sesiones</title>
      </Head>
      <Root>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Box sx={{ height: windowSize[1] - 100 }}>
              {isLoading ? (
                <p>Loading sessions...</p>
              ) : (
                <DataGrid
                  rows={data.map((session) => ({
                    ...session,
                    id: session.idsession,
                    duracion: secondsToHHMMSS(
                      parseInt(session.duracion_segundos)
                    ),
                  }))}
                  columns={[
                    { field: "idsession", headerName: "ID Session", flex: 1 },
                    { field: "inicio", headerName: "Inicio", flex: 1 },
                    { field: "final", headerName: "Final", flex: 1 },
                    {
                      field: "numero_usuarios",
                      headerName: "Cantidad de usuarios",
                      flex: 1,
                    },
                    { field: "duracion", headerName: "Duración", flex: 1 },
                    {
                      field: "actions",
                      headerName: "Acciones",
                      flex: 2.2,
                      renderCell: (params) => {
                        const { idsession: id, final } = params.row;

                        return (
                          <>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => {
                                if (idsession === id) {
                                  generarExcel(
                                    report,
                                    "Reporte sesión " + idsession
                                  );
                                } else {
                                  setIdsession(id);
                                }
                              }}
                            >
                              Descargar reporte
                            </Button>
                            {final === null ? (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleCloseSession.mutate(id)}
                              >
                                Terminar sesión
                              </Button>
                            ) : null}
                          </>
                        );
                      },
                    },
                  ]}
                />
              )}
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartNewSession}
            >
              Iniciar nueva sesión de juego
            </Button>
          </Grid>
        </Grid>
      </Root>
    </>
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

export default Home;
