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

export default function AssignNewTeacherDialog(props) {
  const classes = useStyles();
  const {
    open,
    handleClose,
    groupDetails,
    setAlert,
    updateGroupInTable,
  } = props;

  const [teacherFullName, setTeacherFullName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const auth = useContext(AuthContext);

  function addTeacherToInput({ id, fullName }) {
    setTeacherFullName(fullName);
    setTeacherId(id);
  }
  async function assignNewTeacher() {
    const requestObject = {
      newTeacherId: teacherId,
      groupId: groupDetails.groupId,
    };
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };

    try {
      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_API_URL}/api/v1/groups/assign-teacher`,
        data: requestObject,
        headers: headersObject,
      });

      if (response.data.status === "success") {
        updateGroupInTable({
          name: response.data.group.name,
          teacherFullName: response.data.group.teacher.fullName,
        });

        setAlert({
          open: true,
          message: "New teacher assigned successfully",
          backgroundColor: "#4BB543",
        });
        handleClose();
      } else {
        new Error("Something else happened");
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "New teacher couldn't assigned",
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
        Add teacher to group
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
                    onClick={addTeacherToInput}
                    detailsObject={{
                      url: `${process.env.REACT_APP_API_URL}/api/v1/users/teacherEmails`,
                      inputName: "Teacher name",
                    }}
                  />
                </Grid>

                <Grid item md={12}>
                  <TextField
                    id="teacher-name"
                    label="Teacher Name"
                    type="text"
                    fullWidth
                    value={teacherFullName}
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
            assignNewTeacher();
          }}
          variant="contained"
          color="primary"
        >
          Submit data
        </Button>
        <Button
          onClick={() => {
            handleClose();
            setTeacherFullName("");
            setTeacherId("");
          }}
          color="primary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
