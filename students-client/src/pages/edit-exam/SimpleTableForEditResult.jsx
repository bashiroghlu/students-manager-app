import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles({
  table: {
    minWidth: 350,
  },
  headerContainer: {
    display: "flex",
    padding: "1em 1em 0 1em",
  },
  title: {
    padding: "0.1em",
  },
});

export default function SimpleTableForEditResult(props) {
  const { rows, tableHeaderOptions, selected, setSelected } = props;
  const classes = useStyles();

  return (
    <Table className={classes.table} aria-label="caption table">
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
        {rows.map((row) => (
          <TableRow key={row.participant._id}>
            <TableCell padding="checkbox">
              <Checkbox
                checked={
                  Object.keys(selected).length === 0 &&
                  selected.constructor === Object
                    ? false
                    : selected._id === row._id
                }
                inputProps={{ "aria-labelledby": "check-box" }}
                onChange={() => {
                  if (
                    (Object.keys(selected).length === 0 &&
                      selected.constructor === Object) ||
                    !(selected._id === row._id)
                  ) {
                    setSelected(row);
                  } else {
                    setSelected({});
                  }
                }}
              />
            </TableCell>
            <TableCell component="th" align="left" scope="row">
              {row.participant.fullName}
            </TableCell>
            <TableCell component="th" align="left" scope="row">
              {`W1 ${row.resultWritingOne}
                 W  ${row.resultWritingTwo}   R ${row.resultReading}   L ${row.resultListening}   S ${row.resultSpeaking} `}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
