import React, { useState, useContext } from "react";
import axios from "axios";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import Snackbar from "@material-ui/core/Snackbar";
import List from "../../components/ui/small-components/List";
import AutoCompleteInput from "../../components/ui/AutoCompleteInput";
import SimpleConfirmDialog from "../../components/ui/SimpleConfirmDialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AuthContext } from "../../context/auth-context";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: "1em",
  },

  denseContainer: {
    overflowX: "auto",
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  button: {
    // marginTop: "0.5em",
  },
  deleteIcon: {
    // color: "blue",
  },
  menuList: {
    position: "absolute",
    backgroundColor: "white",
    zIndex: 1200,
    padding: "1em",
    boxShadow: "-1px 4px 13px -1px rgba(0,0,0,0.75)",
    minWidth: "24em",
    marginTop: "-1em",
  },
}));

export default function LayoutTextFields() {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const theme = useTheme();

  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  // const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const [createConfirmDialog, setCreateConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirm: "",
    cancel: "",
  });
  const handleCreateConfirmDialogClose = () => {
    setCreateConfirmDialog({
      ...createConfirmDialog,
      open: false,
    });
  };
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const [checkedStudent, setCheckedStudent] = useState("");
  const [groupName, setGroupName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [studentsInTable, setStudentsInTable] = useState([]);

  function toggleCheckbox(item) {
    if (item === checkedStudent) {
      setCheckedStudent("");
    } else {
      setCheckedStudent(item);
    }
  }

  function addStudentToTable({ id, fullName, email }) {
    if (studentsInTable.find((student) => student.id === id)) {
      return;
    } else {
      setStudentsInTable([...studentsInTable, { id, fullName, email }]);
    }
  }

  function deleteStudent() {
    const filteredStudents = studentsInTable.filter(
      (student) => student.id !== checkedStudent
    );
    setStudentsInTable(filteredStudents);
    setCheckedStudent("");
    setAlert({
      open: true,
      message: "User successfully deleted from list ",
      backgroundColor: "#4BB543",
    });
  }

  function addTeacherToTeacherInput({ id, fullName }) {
    setTeacherId(id);
    setTeacherName(fullName);
  }

  async function createGroup() {
    if (!groupName || !teacherId || studentsInTable.length === 0) {
      handleCreateConfirmDialogClose();
      return setAlert({
        open: true,
        message:
          "Please make sure you added group name, students to group and teacher name",
        backgroundColor: "#FFC107",
        timeout: 4000,
      });
    }
    handleCreateConfirmDialogClose();
    const requestObject = {
      students: studentsInTable.map((student) => student.id),
      name: groupName,
      createdBy: auth.userId,
      teacher: teacherId,
    };
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };

    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/v1/groups/`,
        data: requestObject,
        headers: headersObject,
      });
      if (response.data.status === "success") {
        setAlert({
          open: true,
          message: "Group created successfully",
          backgroundColor: "#4BB543",
        });
        setStudentsInTable([]);
        setGroupName("");
        setTeacherId("");
        setTeacherName("");
      }
    } catch (error) {
      console.log(error);

      setAlert({
        open: true,
        message: "Group couldn't created",
        backgroundColor: "#FF3232",
      });
    }
  }

  return (
    <Grid
      container
      direction="row"
      component={Paper}
      className={classes.root}
      justify="space-between"
    >
      <Grid container direction="row" spacing={2} alignItems="flex-start">
        <Grid item md={8} container>
          <Grid
            container
            spacing={2}
            direction={matchesSM ? "column" : "row"}
            style={{ marginBottom: "0.25em" }}
          >
            <Grid item md={6}>
              <AutoCompleteInput
                onClick={addStudentToTable}
                detailsObject={{
                  url: `${process.env.REACT_APP_API_URL}/api/v1/users/emails`,
                  inputName: "Student name",
                }}
              />
            </Grid>
            <Grid item md={6}>
              <AutoCompleteInput
                onClick={addTeacherToTeacherInput}
                detailsObject={{
                  url: `${process.env.REACT_APP_API_URL}/api/v1/users/teacherEmails`,
                  inputName: "Teacher name",
                }}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="standard-secondary"
                label="Add Group Name"
                color="secondary"
                fullWidth
                value={groupName}
                onChange={(event) => {
                  setGroupName(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="teacher-name"
                label="Teacher name"
                color="secondary"
                fullWidth
                value={teacherName}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setCreateConfirmDialog({
                    open: true,
                    title: "create group",
                    description: "Are you sure that you want to create group",
                    confirm: "Confirm",
                    cancel: "Cancel",
                  });
                }}
              >
                Create Group
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4} xs={12}>
          <List
            items={studentsInTable}
            checkedStudent={checkedStudent}
            setCheckedStudent={toggleCheckbox}
            height={200}
          />
          {checkedStudent && (
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<DeleteIcon className={classes.deleteIcon} />}
              onClick={deleteStudent}
              fullWidth
              style={{ marginTop: "1em" }}
            >
              Delete
            </Button>
          )}
        </Grid>
      </Grid>
      {/* <Grid
        container
        spacing={2}
        justify="space-between"
        style={matchesSM ? { paddingTop: "8px" } : null}
        direction={matchesXS ? "column-reverse" : "row"}
      >
        <Grid item xs sm={4}></Grid>
      </Grid> */}
      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={alert.timeout || 2000}
      />
      <SimpleConfirmDialog
        handleClose={handleCreateConfirmDialogClose}
        handleConfirm={createGroup}
        elements={{
          title: createConfirmDialog.title,
          description: createConfirmDialog.description,
          confirm: createConfirmDialog.confirm,
          cancel: createConfirmDialog.cancel,
        }}
        open={createConfirmDialog.open}
      />
    </Grid>
  );
}
