import * as React from "react";
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
} from "@mui/material";
import {
  PanToolAlt,
  QuestionAnswer,
  Done,
  Timeline,
  ExitToApp,
  FmdBad,
} from "@mui/icons-material";
const iconsByAction = {
  interacted: <PanToolAlt />,
  accessed: <Done />,
  progressed: <Done />,
  completed: <Done />,
  exited: <ExitToApp />,
  answered: <QuestionAnswer />,
  failed: <FmdBad />,
};

export default function NestedList({ data, isLoading }) {
  if (isLoading || !data) return <CircularProgress />;
  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="Seguimiento"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Seguimiento a la sesión de juego
        </ListSubheader>
      }
    >
      {data?.map((trace) => (
        <ListItem key={trace.idtraces}>
          <ListItemAvatar >
            <Avatar sx={{bgcolor:"purple"}}>{iconsByAction[trace.verb] ?? <Timeline />}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${trace.name} | ${trace.actor} ${trace.verb} ${trace.object}`}
            secondary={`${date.humanize(new Date(trace.timestamp))} ${date.format(
              new Date(trace.timestamp),
              "dd-MM hh:mm a"
            )}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
