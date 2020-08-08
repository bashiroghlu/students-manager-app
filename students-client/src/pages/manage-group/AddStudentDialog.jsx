import React, { useState, useContext } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import AutoCompleteInput from "../../components/ui/AutoCompleteInput";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { AuthContext } from "../../context/auth-context";

const useStyles = makeStyles((theme) => ({}));

export default function AddStudentDialog(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const {
    open,
    handleClose,
    groupId,
    toggleRefreshNeeded,
    studentsInList,
    setAlert,
  } = props;
  const [studentFullName, setStudentFullName] = useState("");
  const [studentId, setStudentId] = useState("");

  function addStudentToInput({ id, fullName }) {
    setStudentId(id);
    setStudentFullName(fullName);
  }

  async function addStudenToGroup(studentId) {
    handleClose();
    const requestObject = {
      studentId,
    };

    if (
      studentsInList.find((studentInList) => studentInList.id === studentId)
    ) {
      setStudentFullName("");
      setStudentId("");
      setAlert({
        open: true,
        message: "This user is already in group",
        backgroundColor: "#FF3232",
      });
      return;
    }

    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };

    try {
      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_API_URL}/api/v1/groups/${groupId}`,
        data: requestObject,
        headers: headersObject,
      });

      if (response.data.status === "success") {
        toggleRefreshNeeded();
        setStudentFullName("");
        setStudentId("");
        setAlert({
          open: true,
          message: "Student added successfully",
          backgroundColor: "#4BB543",
        });
      } else {
        new Error("Something else happened");
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Student couldn't added",
        backgroundColor: "#FF3232",
      });
    }
  }

  return (
    <Dialog
      minwidth="md"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">
        Add student to group
      </DialogTitle>
      <DialogContent>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid
              item
              container
              direction="row"
              spacing={2}
              style={{ marginBottom: "8em" }}
            >
              <Grid
                container
                justify="space-around"
                style={{ paddingRight: "3em", paddingLeft: "3em" }}
                spacing={2}
              >
                <Grid item md={12} style={{ paddingTop: "2em" }}>
                  <AutoCompleteInput
                    onClick={addStudentToInput}
                    detailsObject={{
                      url: `${process.env.REACT_APP_API_URL}/api/v1/users/emails`,
                      inputName: "Student name",
                    }}
                  />
                </Grid>

                <Grid item md={12}>
                  <TextField
                    id="student-name"
                    label="Student Name"
                    type="text"
                    fullWidth
                    value={studentFullName}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            addStudenToGroup(studentId);
          }}
          variant="contained"
          color="primary"
        >
          Submit data
        </Button>
        <Button
          onClick={() => {
            handleClose();
            setStudentFullName("");
            setStudentId("");
          }}
          color="primary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
