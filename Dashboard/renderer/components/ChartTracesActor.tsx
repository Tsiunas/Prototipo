import { Box } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "react-query";
import { getStatsActor } from "./rqAppi/Api";
import { useAtom } from "jotai";
import { sessionAtom } from "./rqAppi/atoms";
import { useEffect } from "react";

export const ChartTracesActor = () => {
  const [session] = useAtom(sessionAtom);
  const { data, refetch } = useQuery("tracesstatactor", () => {
    return getStatsActor(session.idsession);
  });

  useEffect(() => {
    // Realizar refetch cuando cambie la sesión
    refetch();
  }, [session, refetch]);


  let state = {
    series: [
      {
        data: data?.map((st) => st.cantidad) || [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: data?.map((st) => st.actor) || [],
      },
    },
  };

  return (
    <Box sx={{ width: "90%", bgcolor: "background.paper" }}>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
      />
    </Box>
  );
};
