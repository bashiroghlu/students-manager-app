import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableContainer from "@material-ui/core/TableContainer";
import SimpleTableForPublishPage from "./SimpleTableForPublishPage";
import SimpleConfirmDialog from "../../components/ui/SimpleConfirmDialog";
import { AuthContext } from "../../context/auth-context";

export default function PublishExamResults() {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [students, setStudents] = useState([]);
  const [examName, setExamName] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const [publishConfirmDialog, setPublishConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirm: "",
    cancel: "",
  });

  const handlePublishConfirmDialogClose = () => {
    setPublishConfirmDialog({
      ...publishConfirmDialog,
      open: false,
    });
  };

  const tableHeaderOptions = [
    { name: "#" },
    { name: "Full Name" },
    { name: "Score" },
  ];
  const examId = useParams().examId;

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
          url: `${process.env.REACT_APP_API_URL}/api/v1/exams/${examId}`,
          cancelToken: source.token,
          headers: headersObject,
        });

        if (response.data.status === "success") {
          setLoading(false);
          setStudents(
            response.data.exam.participants.sort((a, b) =>
              a.participant.fullName.localeCompare(b.participant.fullName)
            )
          );
          setExamName(response.data.exam.examName);
        } else {
          new Error("Something else happened");
        }
      } catch (error) {
        if (axios.isCancel(error)) {
        } else {
          console.log(error);
        }
      }
    }
    getData();
    return source.cancel;
  }, [examId, auth.token]);

  function makeDialogDescription(students) {
    const studentsFullNamesArray = [];

    for (let index = 0; index < students.length; index++) {
      if (
        Number(students[index].resultReading) === 0 ||
        Number(students[index].resultSpeaking) === 0 ||
        Number(students[index].resultWritingOne) === 0 ||
        Number(students[index].resultWritingTwo) === 0 ||
        Number(students[index].resultListening) === 0
      ) {
        studentsFullNamesArray.push(students[index].participant.fullName);
      }
    }

    if (studentsFullNamesArray.length === 0) {
      return `Results looks fine `;
    }
    return `${
      studentsFullNamesArray.length > 1
        ? studentsFullNamesArray.join(", ")
        : studentsFullNamesArray.join("")
    }${
      studentsFullNamesArray.length > 1 ? " students'" : "'s"
    } results contain 0, are you sure to publish this results? `;
  }

  async function publishExamResults(students) {
    const ResultObjs = students.map((student) => {
      return {
        studentEmail: student.participant.email,
        resultReading: student.resultReading,
        resultSpeaking: student.resultSpeaking,
        resultWritingOne: student.resultWritingOne,
        resultWritingTwo: student.resultWritingTwo,
        resultListening: student.resultListening,
      };
    });
    const requestObject = {
      results: ResultObjs,
      examName: examName,
    };
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/v1/exams/publish-exam`,
        data: requestObject,
        headers: headersObject,
      });

      if (response.data.status === "success") {
        setAlert({
          open: true,
          message: "Emails are sent successfully",
          backgroundColor: "#4BB543",
        });
        handlePublishConfirmDialogClose();
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Emails couldn't sent successfully",
        backgroundColor: "#FF3232",
      });
    }
  }

  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      style={{ maxWidth: "100%" }}
    >
      <Grid
        container
        item
        direction="row"
        style={{ marginBottom: "1em" }}
        justify="space-between"
        spacing={2}
      >
        <Grid item md={3} xs={12} sm={6}>
          <Button
            variant="contained"
            onClick={() => {
              setPublishConfirmDialog({
                open: true,
                title: "Publish student's results",
                description: "Are you sure that you want to update group name",
                confirm: "Confirm",
                cancel: "Cancel",
              });
            }}
            fullWidth
          >
            Publish
          </Button>
        </Grid>
        <Grid item md={3} xs={12} sm={6}>
          <Button
            variant="contained"
            onClick={() => {
              history.goBack();
            }}
            fullWidth
          >
            Go back
          </Button>
        </Grid>
      </Grid>
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
        <Grid
          item
          style={{ marginBottom: "1em", maxWidth: "100%" }}
          component={Paper}
        >
          <TableContainer>
            <SimpleTableForPublishPage
              tableHeaderOptions={tableHeaderOptions}
              rows={students}
            />
          </TableContainer>
        </Grid>
      )}

      <SimpleConfirmDialog
        handleClose={handlePublishConfirmDialogClose}
        handleConfirm={() => {
          publishExamResults(students);
        }}
        elements={{
          title: publishConfirmDialog.title,
          description: makeDialogDescription(students),
          confirm: publishConfirmDialog.confirm,
          cancel: publishConfirmDialog.cancel,
        }}
        open={publishConfirmDialog.open}
      />
      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={alert.timeout || 2000}
      />
    </Grid>
  );
}
