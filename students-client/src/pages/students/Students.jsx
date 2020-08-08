import React, { useState, useEffect, useContext } from "react";

import axios from "axios";

// import { makeStyles } from "@material-ui/core/styles";
import EnhancedTable from "./EnhancedTable";

import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Grid from "@material-ui/core/Grid";

import { AuthContext } from "../../context/auth-context";
import FilterDialog from "../../components/ui/dialogs/FilterDialog";

// const useStyles = makeStyles({
//   root: {
//     padding: "1em",
//     marginBottom: "2em",
//   },
// });

export default function Students() {
  // const classes = useStyles();
  const auth = useContext(AuthContext);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [refreshNeeded, setRefreshNeeded] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filterDialog, setFilterDialog] = useState(false);

  function toggleRefreshNeeded() {
    setRefreshNeeded(!refreshNeeded);
  }

  function applyFilter(filterObj) {
    let filteredStudents = students;
    if (filterObj.teacherName !== "Not choosen") {
      filteredStudents = students.filter(
        (student) => student.teacher === filterObj.teacherName
      );
    }

    setFilteredStudents(filteredStudents);
    setFilterDialog(false);
  }
  function openFilterDialog() {
    setFilterDialog(true);
  }

  useEffect(() => {
    const source = axios.CancelToken.source();
    setLoading(true);
    async function getData() {
      const headersObject = {
        "Content-Type": "application/json",
        authorization: "Bearer " + auth.token,
      };

      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/api/v1/users`,
          headers: headersObject,
          cancelToken: source.token,
        });

        if (response.data.status === "success") {
          const students = response.data.users.map((student) => ({
            id: student._id,
            name: student.name,
            surname: student.surname,
            teacher: student.teacher.fullName,
          }));

          setStudents(students);
          setFilteredStudents(students);
          setLoading(false);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
        } else {
          setAlert({
            open: true,
            message: "Something happened while fetching data",
            backgroundColor: "#FF3232",
          });
        }
      }
    }
    getData();
    return source.cancel;
  }, [refreshNeeded, auth.token]);

  const loadingComps = (
    <Grid
      style={{ minHeight: "80vh" }}
      container
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  );

  return (
    <div>
      {loading ? (
        loadingComps
      ) : (
        <Grid container>
          <Grid item xs={12}>
            <EnhancedTable
              rows={filteredStudents}
              openFilterDialog={openFilterDialog}
              setAlert={setAlert}
              toggleRefreshNeeded={toggleRefreshNeeded}
            />
          </Grid>

          <Snackbar
            open={alert.open}
            message={alert.message}
            ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={() => setAlert({ ...alert, open: false })}
            autoHideDuration={alert.timeout || 2000}
          />
          <FilterDialog
            open={filterDialog}
            onClick={applyFilter}
            setAlert={setAlert}
            handleClose={() => setFilterDialog(false)}
          />
        </Grid>
      )}
    </div>
  );
}
