import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Select from "../../components/ui/small-components/Select";
import RegisterNewUser from "../../components/ui/dialogs/RegisterNewUser";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import DenseTable from "./DenseTable";
import axios from "axios";
import moment from "moment";

import AutoCompleteInput from "../../components/ui/AutoCompleteInput";
import { AuthContext } from "../../context/auth-context";
import SimpleConfirmDialog from "../../components/ui/SimpleConfirmDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    // minHeight: "16em",
    padding: "1em",
  },
  denseContainer: {
    overflowX: "auto",
  },
}));

export default function StartExam() {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  const tableCells = [{ name: "id" }, { name: "full name" }, { name: "email" }];
  const typeSelectOptions = [
    { label: "IELTS", value: "IELTS" },
    { label: "General", value: "general" },
  ];
  const [studentsInTable, setStudentsInTable] = useState([]);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const [examDate] = useState(`${moment(new Date()).format("LLL")}`);
  const [registerUserDialog, setRegisterUserDialogOpen] = useState(false);
  const [examTypeValue, setExamTypeValue] = useState("IELTS");
  const [refreshNeeded, setRefreshNeeded] = useState(true);
  const [startExamConfirmDialog, setStartExamConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirm: "",
    cancel: "",
  });

  const handleStartExamConfirmDialogClose = () => {
    setStartExamConfirmDialog({
      ...startExamConfirmDialog,
      open: false,
    });
  };

  const [examName, setExamName] = useState(
    `${moment(new Date()).format("LLL")}`
  );

  function toggleRegisterDialog() {
    setRegisterUserDialogOpen(!registerUserDialog);
  }
  function toggleRefresh() {
    setRefreshNeeded(!refreshNeeded);
  }

  function addUserToTable({ id, fullName, email }) {
    if (studentsInTable.find((student) => student.id === id)) {
      return false;
    } else {
      setStudentsInTable([
        ...studentsInTable,
        {
          name: fullName,
          id: id,
          // participant: participanId,
          email: email,
        },
      ]);
    }
  }

  function makeStudentsArray(students) {
    return students.map((student) => ({
      participant: student.id,
    }));
  }

  async function startExam() {
    const requestObject = {
      participants: makeStudentsArray(studentsInTable),
      examName: examName,
      moderatedBy: auth.userId,
      type: examTypeValue,
    };

    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };
    handleStartExamConfirmDialogClose();

    try {
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/v1/exams`,
        data: requestObject,
        headers: headersObject,
      });
      setAlert({
        open: true,
        message: "Exam created successfully",
        backgroundColor: "#4BB543",
      });
      
      setStudentsInTable([]);
    } catch (error) {
      setAlert({
        open: true,
        message: "Exam couldn't created",
        backgroundColor: "#FF3232",
      });
    }
  }

  return (
    <Grid container direction="column">
      <Grid
        item
        container
        direction="column"
        component={Paper}
        style={{ marginBottom: "1em" }}
      >
        <Grid
          item
          container
          direction="row"
          style={{ marginBottom: "1em" }}
          spacing={2}
          alignItems="center"
          className={classes.root}
        >
          <Grid item md={4} sm={6} xs={12}>
            <AutoCompleteInput
              onClick={addUserToTable}
              detailsObject={{
                url: `${process.env.REACT_APP_API_URL}/api/v1/users/emails`,
                inputName: "Student name",
                refreshNeeded,
              }}
            />
          </Grid>

          <Grid item sm={6} md={4} xs={12}>
            {studentsInTable.length > 0 ? (
              <Button
                fullWidth
                color="secondary"
                variant="contained"
                onClick={() => {
                  setStartExamConfirmDialog({
                    open: true,
                    title: "Start exam",
                    description: "Are you sure to start exam?",
                    confirm: "Confirm",
                    cancel: "Cancel",
                  });
                }}
              >
                Start Exam
              </Button>
            ) : null}
          </Grid>
          <Grid item sm={6} md={4} xs={12}>
            {true ? (
              <Button
                fullWidth
                color="secondary"
                variant="contained"
                onClick={() => {
                  setRegisterUserDialogOpen(true);
                }}
              >
                User Register
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="column"
        component={Paper}
        className={classes.root}
      >
        <Grid
          item
          container
          direction="row"
          style={{ marginBottom: "1em" }}
          spacing={2}
          alignItems="center"
        >
          <Grid item md={3} sm={6} xs={12}>
            <TextField
              id="exam-name"
              label="Exam name:"
              // placeholder="Placeholder"
              fullWidth
              margin="normal"
              value={examName}
              onChange={(event) => setExamName(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <TextField
              id="organiser-name"
              label="Organiser's name:"
              fullWidth
              margin="normal"
              value={auth.fullName}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <TextField
              id="exam-date"
              label="Exam Date:"
              fullWidth
              margin="normal"
              value={examDate}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <Select
              options={typeSelectOptions}
              id="type-option"
              label="Exam Type:"
              margin="normal"
              value={examTypeValue}
              fullWidth
              handleChange={(event) => setExamTypeValue(event.target.value)}
            />
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction="row"
          // style={{ marginBottom: "1em" }}
          spacing={2}
          alignItems="center"
        >
          <DenseTable
            tableCells={tableCells}
            rows={studentsInTable}
            className={classes.denseContainer}
          />
        </Grid>
      </Grid>
      <RegisterNewUser
        open={registerUserDialog}
        toggleRegisterDialog={toggleRegisterDialog}
        setAlert={setAlert}
        toggleRefresh={toggleRefresh}
      />
      <SimpleConfirmDialog
        handleClose={handleStartExamConfirmDialogClose}
        handleConfirm={startExam}
        elements={{
          title: startExamConfirmDialog.title,
          description: startExamConfirmDialog.description,
          confirm: startExamConfirmDialog.confirm,
          cancel: startExamConfirmDialog.cancel,
        }}
        open={startExamConfirmDialog.open}
      />

      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={4000}
      />
    </Grid>
  );
}
