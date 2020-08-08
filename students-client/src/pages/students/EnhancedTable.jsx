import React, { useContext, useEffect } from "react";
import axios from "axios";

import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";
import ArchiveIcon from "@material-ui/icons/Archive";
import FilterListIcon from "@material-ui/icons/FilterList";
import { AuthContext } from "../../context/auth-context";
import SimpleConfirmDialog from "../../components/ui/SimpleConfirmDialog";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  { id: "surname", numeric: false, disablePadding: false, label: "Surname" },
  { id: "teacher", numeric: false, disablePadding: false, label: "Teacher" },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();

  const {
    numSelected,
    dense,
    handleChangeDense,
    openFilterDialog,
    setArchiveConfirmDialog,
    auth,
  } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Students List
        </Typography>
      )}

      {numSelected > 0 && !(auth.status === "teacher") ? (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={() => {
              setArchiveConfirmDialog({
                open: true,
                title: "Archive users",
                description:
                  "Are you sure that you want to archive these users",
                confirm: "Confirm",
                cancel: "Cancel",
              });
            }}
          >
            <ArchiveIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          {auth.status === "teacher" ? null : (
            <Tooltip title="Filter list">
              <IconButton onClick={openFilterDialog} aria-label="filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Dense table">
            <Switch checked={dense} onChange={handleChangeDense} />
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
}));

export default function EnhancedTable({
  rows,
  openFilterDialog,
  setAlert,
  toggleRefreshNeeded,
}) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [archiveConfirmDialog, setArchiveConfirmDialog] = React.useState({
    open: false,
    title: "",
    description: "",
    confirm: "",
    cancel: "",
  });
  const handleArchiveConfirmDialogClose = () => {
    setArchiveConfirmDialog({
      ...archiveConfirmDialog,
      open: false,
    });
  };
  const auth = useContext(AuthContext);

  async function archiveUsers() {
    const requestObject = {
      users: selected,
    };
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };
    try {
      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_API_URL}/api/v1/users/`,
        data: requestObject,
        headers: headersObject,
      });

      if (response.status === 204) {
        setAlert({
          open: true,
          message: "User archived successfully",
          backgroundColor: "#4BB543",
        });
        toggleRefreshNeeded();
        handleArchiveConfirmDialogClose();
        setSelected([]);
      } else {
        new Error("Something else happened");
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "User couldn't archived",
        backgroundColor: "#FF3232",
      });
    }
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    const denseTable = JSON.parse(localStorage.getItem("denseTable"));
    if (denseTable && denseTable.dense === true) {
      return setDense(true);
    }
    setDense(false);
  }, [setDense]);

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
    localStorage.setItem(
      "denseTable",
      JSON.stringify({ dense: event.target.checked })
    );
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          openFilterDialog={openFilterDialog}
          numSelected={selected.length}
          dense={dense}
          handleChangeDense={handleChangeDense}
          archiveUsers={archiveUsers}
          setArchiveConfirmDialog={setArchiveConfirmDialog}
          auth={auth}
        />

        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      key={row.id}
                      hover
                      onClick={() => handleClick(row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.surname}</TableCell>
                      <TableCell align="left">{row.teacher}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <SimpleConfirmDialog
        handleClose={handleArchiveConfirmDialogClose}
        handleConfirm={archiveUsers}
        elements={{
          title: archiveConfirmDialog.title,
          description: archiveConfirmDialog.description,
          confirm: archiveConfirmDialog.confirm,
          cancel: archiveConfirmDialog.cancel,
        }}
        open={archiveConfirmDialog.open}
      />
    </div>
  );
}
