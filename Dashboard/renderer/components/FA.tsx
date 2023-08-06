import React, { useEffect, useRef, useState } from "react";
import { date } from "aster-utils";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { useQuery } from "react-query";
import {
  Avatar,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import {
  PanToolAlt,
  QuestionAnswer,
  Done,
  Timeline,
  ExitToApp,
  FmdBad,
} from "@mui/icons-material";

export default function TsiunasTable({ data, isLoading }) {
  const [tsunasT, setTsiunasT] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const [users, setUsers] = useState([]);
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    if (data) {
      let t = data.filter((d) => d.verb === "earned" && d.object === "item" && d.object_type==="flama");
      setUsers([...new Set(t.map((d) => d.user_id))]);
      setCharacters([...new Set(t.map((d) => d.result.split("|")[1]))]);
      setTsiunasT(t);
    }
  }, [data]);
  const steps = [
    "Flama 1",
    "Flama 2",
    "Flama 3",
    "Flama 4",
    "Flama 5",
    "Flama 6",
    "Flama 7",
    "Flama 8",
    "Flama 9",
  ];

  if (isLoading || !data) return <CircularProgress />;
  return (
    <>
      <Box sx={{ width: "100%" }}>
        {users.map((u) => {
          let fl = tsunasT.filter((t) => t.user_id === u).reverse();

          return (
            <>
              <Typography variant="h5" gutterBottom>
                Progreso de {tsunasT.filter((f) => f.user_id === u)[0].actor}{" "}
                id: {u}
              </Typography>
              <Stepper activeStep={fl.length - 1}>
                {steps.map((label, index) => {
                  const stepProps: { completed?: boolean } = {};
                  const labelProps: {
                    optional?: React.ReactNode;
                  } = {};

                  labelProps.optional = (
                    <Typography variant="caption">
                      {fl[index]?.target.replace("PNJ_", "")}
                    </Typography>
                  );
                  stepProps.completed = index < fl.length;

                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </>
          );
        })}
      </Box>
    </>
  );
}
