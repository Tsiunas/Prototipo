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
  const [users, setUsers] = useState([]);
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    if (data) {
      let t = data.filter((d) => d.verb === "dragged" && d.object === "item" && d.object_type==="tsiuna");
      setUsers([...new Set(t.map((d) => d.user_id))]);
      setCharacters([...new Set(t.map((d) => d.target))]);
      setTsiunasT(t);
    }
  }, [data]);
  if (isLoading || !data) return <CircularProgress />;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Usuarios</TableCell>
            {characters?.map((c) => (
              <TableCell align="right">{c.replace("PNJ_", "")}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row) => (
            <TableRow
              key={row}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {
                  tsunasT.filter(
                    (f) =>
                      f.user_id === row && f.success === 1
                  )[0].name
                }{" "}
                id: {row}
              </TableCell>
              {characters?.map((c) => {
                let exito = tsunasT.filter(
                  (f) =>
                    f.user_id === row &&
                    f.success === 1  &&
                    f.target === c
                );
                let fallido = tsunasT.filter(
                  (f) =>
                    f.user_id === row &&
                    f.success === 0 &&
                    f.target === c
                );

                return (
                  <TableCell align="right">
                    Exitosas: {exito.length} Fallidas:{fallido.length}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
