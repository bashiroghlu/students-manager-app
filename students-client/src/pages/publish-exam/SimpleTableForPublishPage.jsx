import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles({
  table: {
    minWidth: 350,
  },
});

export default function SimpleTableForPublishPage(props) {
  const { rows, tableHeaderOptions } = props;
  const classes = useStyles();

  return (
    <Table className={classes.table} aria-label="caption table" size="small">
      <TableHead>
        <TableRow>
          {tableHeaderOptions.map((option) => (
            <TableCell align="left" key={option.name}>
              {option.name}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.participant._id}>
            <TableCell component="th" align="left" scope="row">
              {index}
            </TableCell>
            <TableCell align="left" scope="row">
              {row.participant.fullName}
            </TableCell>
            <TableCell align="left" scope="row">
              {`W1 ${row.resultWritingOne}
                 W  ${row.resultWritingTwo}   R ${row.resultReading}   L ${row.resultListening}   S ${row.resultSpeaking} `}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
