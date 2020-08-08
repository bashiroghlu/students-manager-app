import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import SimpleTableForEditResult from "./SimpleTableForEditResult";
import ResultsInputDialog from "./ResultsInputDialog";

import Snackbar from "@material-ui/core/Snackbar";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { AuthContext } from "../../context/auth-context";

export default function EditExamResults(props) {
  const examId = useParams().examId;
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const [dataInputDialogOpen, setDataInputDialogOpen] = React.useState(false);
  function openDataInputDialog() {
    if (
      !(Object.keys(selected).length === 0 && selected.constructor === Object)
    ) {
      setDataInputDialogOpen(true);
    } else {
      return;
    }
  }

  const closeDataInputDialog = () => {
    setSelected({});
    setDataInputDialogOpen(false);
  };

  const tableHeaderOptions = [
    { name: "#" },
    { name: "Name and surname" },
    { name: "Score" },
  ];

  useEffect(() => {
    const source = axios.CancelToken.source();
    async function getData() {
      setLoading(true);
      const headersObject = {
        "Content-Type": "application/json",
        authorization: "Bearer " + auth.token,
      };
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/api/v1/exams/${examId}`,
          headers: headersObject,
          cancelToken: source.token,
        });

        if (response.data.status === "success") {
          setStudents(
            response.data.exam.participants.sort((a, b) =>
              a.participant.fullName.localeCompare(b.participant.fullName)
            )
          );
          setLoading(false);
        } else {
          new Error("Something else happened");
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          //console.log("axios cancel error");
        } else {
          console.log(error);
        }
      }
    }
    getData();
    return source.cancel;
  }, [examId, auth.token]);

  function moveToPublishPage() {
    history.push(`/publish-results/${examId}`);
  }

  function updateStudentResults(updatedStudentObject) {
    const filteredStudents = students.filter(
      (student) => student.participant._id !== updatedStudentObject.participant
    );
    const updatedStudent = students.find(
      (student) => student.participant._id === updatedStudentObject.participant
    );
    const updatedStudents = [
      ...filteredStudents,
      {
        ...updatedStudent,
        resultWritingOne: updatedStudentObject.resultWritingOne,
        resultWritingTwo: updatedStudentObject.resultWritingTwo,
        resultReading: updatedStudentObject.resultReading,
        resultSpeaking: updatedStudentObject.resultSpeaking,
        resultListening: updatedStudentObject.resultListening,
      },
    ].sort((a, b) =>
      a.participant.fullName.localeCompare(b.participant.fullName)
    );
    setStudents(updatedStudents);
  }

  return (
    <Grid container direction="column" justify="space-between">
      <Grid
        container
        direction="row"
        spacing={2}
        style={{ marginBottom: "1em" }}
        justify="space-between"
      >
        <Grid item md={3} xs={12} sm={6}>
          <Button
            variant="contained"
            // disabled={!!selected}
            fullWidth
            onClick={() => moveToPublishPage()}
          >
            Publish results
          </Button>
        </Grid>
        <Grid item md={3} xs={12} sm={6}>
          <Button
            variant="contained"
            disabled={
              Object.keys(selected).length === 0 &&
              selected.constructor === Object
            }
            fullWidth
            onClick={() => openDataInputDialog()}
          >
            Edit Student's results
          </Button>
        </Grid>
      </Grid>

      <Grid container direction="row">
        {loading ? (
          <Grid
            style={{ minHeight: "30vh" }}
            container
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        ) : (
          <Grid item xs component={Paper}>
            <TableContainer>
              <SimpleTableForEditResult
                selected={selected}
                setSelected={setSelected}
                tableHeaderOptions={tableHeaderOptions}
                rows={students}
                checkbox
              />
            </TableContainer>
          </Grid>
        )}

        {!(
          Object.keys(selected).length === 0 && selected.constructor === Object
        ) ? (
          <ResultsInputDialog
            dataInputDialogOpen={dataInputDialogOpen}
            updateStudentResults={updateStudentResults}
            closeDataInputDialog={() => {
              closeDataInputDialog();
            }}
            setAlert={setAlert}
            selected={selected}
          />
        ) : null}
        <Snackbar
          open={alert.open}
          message={alert.message}
          ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => setAlert({ ...alert, open: false })}
          autoHideDuration={alert.timeout || 2000}
        />
      </Grid>
    </Grid>
  );
}
