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

export default function SimpleTableForIeltsExams(props) {
  const classes = useStyles();

  const { rows, tableHeaderOptions, selected, setSelected, checkbox } = props;

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
          <TableRow key={row._id}>
            {checkbox ? (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected === row.id}
                  inputProps={{ "aria-labelledby": "check-box" }}
                  onChange={() => {
                    if (!(row.id === selected)) {
                      setSelected(row.id);
                    } else {
                      setSelected(false);
                    }
                  }}
                />
              </TableCell>
            ) : null}
            <TableCell component="th" scope="row">
              {row.examName}
            </TableCell>
            <TableCell>{row.participants.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
