import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Grid, Paper, styled, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "react-query";
import { getModelInfo } from "../components/rqAppi/Api";
import { useInterval } from "react-use";

const Root = styled("div")(({ theme }) => {
  return {
    textAlign: "center",
    paddingTop: theme.spacing(0),
  };
});

const UserInfo = ({ user }) => (
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="subtitle1" color="primary">
        {user.id}
      </Typography>
      <Typography variant="body2">{user.name}</Typography>
    </Paper>
  </Grid>
);

const ClusterInfo = ({ cluster }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="subtitle1" color="primary">
        Cluster: {cluster.cluster}
      </Typography>
      <Typography variant="body2">Usuarios: {cluster.users}</Typography>
      <Typography variant="body2">
        Frecuencia de acciones machistas: {cluster.machista_frequency}
      </Typography>
      <Typography variant="body2">
        Interacciones Totales: {cluster.interactions_total}
      </Typography>
      <Typography variant="body2">
        Frecuencia de entrega de Tsiunas: {cluster.action_frequency}
      </Typography>
    </Paper>
  </Grid>
);

function Home() {
  const queryClient = useQueryClient();
  const [idsession, setIdsession] = useState(-1);
  const { data: modelInfo, refetch } = useQuery("model", getModelInfo);

  const [windowSize, setWindowSize] = useState([0, 0]);
  useInterval(() => {
    refetch();
  }, 1000);

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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Información del modelo
            </Typography>
            {modelInfo && (
              <div>
                <Typography variant="body1" sx={{ mt: 3 }}>
                  Silhouette Avg: {Math.round(modelInfo.silhouette_avg * 100)}%
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Clusters
                    </Typography>
                    <Grid container spacing={2}>
                      {modelInfo.clusters.map((cluster) => (
                        <ClusterInfo key={cluster.cluster} cluster={cluster} />
                      ))}
                    </Grid>
                  </Grid>
                  {modelInfo.clusters.map((c) => (
                    <Grid item xs={12} sm={6} md={4} key={c.cluster}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Usuarios del Cluster {c.cluster}
                      </Typography>
                      <Grid container spacing={2}>
                        {modelInfo.user_list
                          .filter((user) => user.cluster + "" === c.cluster)
                          .map((user) => (
                            <UserInfo key={user.id} user={user} />
                          ))}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </Grid>
        </Grid>
      </Root>
    </>
  );
}

export default Home;
