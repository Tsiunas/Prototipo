import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Box, Grid, Paper, styled } from "@mui/material";
import ResponsiveAppBar from "../components/NavBar";
import TracesList from "../components/TracesList";
import { useQuery } from "react-query";
import { getTraces } from "../components/rqAppi/Api";
import { ChartTracesVerb } from "../components/ChartTracesVerb";
import { ChartTracesActor } from "../components/ChartTracesActor";
import { height } from "@mui/system";
import { useAtom } from "jotai";
import { sessionAtom } from "../components/rqAppi/atoms";

const Root = styled("div")(({ theme }) => {
  return {
    textAlign: "center",
    paddingTop: theme.spacing(0),
  };
});

function Home() {
  const { data, isLoading } = useQuery("traces", getTraces);
  const [windowSize, setWindowSize] = useState([0, 0]);
  const [session] = useAtom(sessionAtom);

  useEffect(() => {
    function handleResize() {
      setWindowSize([window.innerWidth, window.innerHeight - 68.5]);
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  console.log(session);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Root>
        <Grid container>
          <Grid item xs={12}>
            <h2>
              Sessión número:{session.idsession} | Número de usuarios:{" "}
              {session.numero_usuarios} | Duración:
              {session.final ? session.duracion : "En curso"}
            </h2>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ overflow: "auto", height: windowSize[1] }}>
              <TracesList
                data={data?.filter((d) => d.session_id === session.idsession)}
                isLoading={isLoading}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ overflow: "auto", height: windowSize[1] }}>
              <ChartTracesVerb />
              <ChartTracesActor />
            </Paper>
          </Grid>
        </Grid>
      </Root>
    </>
  );
}

export default Home;
