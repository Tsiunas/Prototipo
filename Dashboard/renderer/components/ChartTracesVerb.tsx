import { Box } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "react-query";
import { getStatsVerb } from "./rqAppi/Api";
import { useAtom } from "jotai";
import { sessionAtom } from "./rqAppi/atoms";
import { useEffect } from "react";

export const ChartTracesVerb = () => {
  const [session] = useAtom(sessionAtom);
  const { data, refetch } = useQuery("tracesstat", () => {
   return getStatsVerb(session.idsession);
  });

  useEffect(() => {
    // Realizar refetch cuando cambie la sesión
    refetch();
  }, [session, refetch]);

  let state = {
    series: data?.map((st) => st.cantidad) || [],
    options: {
      chart: {
        type: "donut",
      },
      labels: data?.map((st) => st.verb) || [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <Box sx={{ width: "90%", bgcolor: "background.paper" }}>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="donut"
      />
    </Box>
  );
};
