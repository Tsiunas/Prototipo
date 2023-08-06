import React, { useEffect } from "react";
import Head from "next/head";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "react-query";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../lib/theme";
import type { EmotionCache } from "@emotion/cache";
import createEmotionCache from "../lib/create-emotion-cache";
import { CacheProvider } from "@emotion/react";
import ResponsiveAppBar from "../components/NavBar";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { getAlerts } from "../components/rqAppi/Api";
import { useInterval } from "react-use";
const clientSideEmotionCache = createEmotionCache();

type MyAppProps = AppProps & {
  emotionCache?: EmotionCache;
};
const Notifications = () => {
  const { data, refetch } = useQuery("alerts", () => {
    return getAlerts();
  });

  useInterval(() => {
    refetch();
  }, 1000);

  useEffect(() => {
    if (data) {
      data.forEach((d) => {
        enqueueSnackbar(d.message, {
          variant: "warning",
        });
      });
    }
  }, [data]);
  return <></>;
};
export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;
  const queryClient = React.useRef(new QueryClient());

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient.current}>
          <SnackbarProvider maxSnack={5}>
            <Hydrate state={pageProps.dehydratedState}>
              <ResponsiveAppBar />
              <Notifications />
              <Component {...pageProps} />
            </Hydrate>
          </SnackbarProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
