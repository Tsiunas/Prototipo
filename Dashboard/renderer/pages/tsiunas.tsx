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
import TsiunasTable from "../components/TsiunasTable";
import FA from "../components/FA";
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
  const [session] = useAtom(sessionAtom);

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
        <title>Dashboard</title>
      </Head>
      <Root>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Paper sx={{ overflow: "auto", height: windowSize[1] }}>
              <TsiunasTable
                data={data?.filter((d) => d.session_id === session.idsession)}
                isLoading={isLoading}
              />
            </Paper>
          </Grid>
        </Grid>
      </Root>
    </>
  );
}

export default Home;
