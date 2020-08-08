import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import GroupManageList from "./GroupManageList";
import AddStudentDialog from "./AddStudentDialog";
import SimpleConfirmDialog from "../../components/ui/SimpleConfirmDialog";
import { AuthContext } from "../../context/auth-context";

const useStyles = makeStyles((theme) => ({
  mainWrapper: {
    padding: "1em",
  },
}));

export default function ManageStudents(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { groupId, setAlert } = props;
  const [checkedStudent, setCheckedStudent] = useState("");
  const [students, setStudents] = useState([]);
  const [refreshNeeded, setRefreshNeeded] = useState(false);
  const [addStudentDialog, setAddStudentDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirm: "",
    cancel: "",
  });
  function toggleCheckbox(item) {
    if (item === checkedStudent) {
      setCheckedStudent("");
    } else {
      setCheckedStudent(item);
    }
  }
  function toggleRefreshNeeded() {
    setRefreshNeeded(!refreshNeeded);
  }
  function closeSimpleDialog() {
    setConfirmDeleteDialog({
      ...confirmDeleteDialog,
      open: false,
    });
  }
  useEffect(() => {
    const source = axios.CancelToken.source();
    async function getData() {
      const headersObject = {
        "Content-Type": "application/json",
        authorization: "Bearer " + auth.token,
      };
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/api/v1/groups/${groupId}`,
          headers: headersObject,
          cancelToken: source.token,
        });

        if (response.data.status === "success") {
          setStudents(response.data.data.students);
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
  }, [refreshNeeded, groupId, auth.token]);

  async function deleteStudenFromGroup() {
    closeSimpleDialog();
    const requestObject = {
      studentId: checkedStudent,
    };
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };

    try {
      const response = await axios({
        method: "delete",
        url: `${process.env.REACT_APP_API_URL}/api/v1/groups/delete-user/${groupId}`,
        data: requestObject,
        headers: headersObject,
      });

      if (response.status === 204) {
        setRefreshNeeded(!refreshNeeded);
        setCheckedStudent("");
        setAlert({
          open: true,
          message: "Student deleted successfully",
          backgroundColor: "#4BB543",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Student couldn't deleted",
        backgroundColor: "#FF3232",
      });
      closeSimpleDialog();
    }
  }

  return (
    <Grid
      item
      container
      component={Paper}
      className={classes.mainWrapper}
      direction="column"
    >
      <Grid container direction="row" spacing={2}>
        <Grid item md={8} xs={12}>
          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              <Button
                fullWidth
                variant="contained"
                disabled={checkedStudent !== ""}
                onClick={() => {
                  setAddStudentDialog(true);
                }}
              >
                Add Student
              </Button>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={() =>
                  setConfirmDeleteDialog({
                    open: true,
                    title: "Updating user Details",
                    description:
                      "Are you sure that you want to update your data",
                    confirm: "Yes, I Confirm",
                    cancel: "Cancel",
                  })
                }
                disabled={checkedStudent === ""}
              >
                Delete Student
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4} xs={12}>
          <GroupManageList
            items={students}
            checkedStudent={checkedStudent}
            setCheckedStudent={toggleCheckbox}
            deleteStudenFromGroup={deleteStudenFromGroup}
          />
        </Grid>
      </Grid>
      <AddStudentDialog
        studentsInList={students}
        open={addStudentDialog}
        groupId={groupId}
        handleClose={() => {
          setAddStudentDialog(false);
        }}
        setAlert={setAlert}
        toggleRefreshNeeded={toggleRefreshNeeded}
      />

      <SimpleConfirmDialog
        handleConfirm={deleteStudenFromGroup}
        handleClose={() => {
          closeSimpleDialog();
        }}
        elements={{
          title: confirmDeleteDialog.title,
          description: confirmDeleteDialog.description,
          confirm: confirmDeleteDialog.confirm,
          cancel: confirmDeleteDialog.cancel,
        }}
        open={confirmDeleteDialog.open}
      />
      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={2000}
      />
    </Grid>
  );
}
