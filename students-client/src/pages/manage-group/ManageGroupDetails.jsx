import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import SimpleConfirmDialog from "../../components/ui/SimpleConfirmDialog";
import DeleteIcon from "@material-ui/icons/Delete";
import { AuthContext } from "../../context/auth-context";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AssignNewTeacherDialog from "./AssignNewTeacherDialog";
const useStyles = makeStyles((theme) => ({
  mainWrapper: {
    padding: "1em",
  },
}));

export default function ManageStudents(props) {
  const classes = useStyles();
  const {
    groupDetails,
    setAlert,
    updateGroupInTable,

    resetGroupPage,
  } = props;
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirm: "",
    cancel: "",
  });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirm: "",
    cancel: "",
  });
  const [assignTeacherDialog, setAssignTeacherDialog] = useState(false);
  const [groupName, setGroupName] = useState(groupDetails.groupName);
  const [groupTeacher, setGroupTeacher] = useState(groupDetails.groupTeacher);
  const auth = useContext(AuthContext);

  useEffect(() => {
    setGroupName(groupDetails.groupName);
    setGroupTeacher(groupDetails.groupTeacher);
  }, [groupDetails]);

  const handleDialogClose = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false,
    });
  };
  const handleDeleteConfirmDialogClose = () => {
    setConfirmDialog({
      ...deleteConfirmDialog,
      open: false,
    });
  };

  async function deleteGroup() {
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };
    try {
      const response = await axios({
        method: "delete",
        url: `${process.env.REACT_APP_API_URL}/api/v1/groups/${groupDetails.groupId}`,
        headers: headersObject,
      });

      if (response.data.status === "success") {
        resetGroupPage();
        setAlert({
          open: true,
          message: "groupname deleted successfully",
          backgroundColor: "#4BB543",
        });
      } else {
        new Error("Something else happened");
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "groupname couldn't deleted",
        backgroundColor: "#FF3232",
      });
    }
  }

  async function updateGroupName() {
    const requestObject = {
      name: groupName,
      groupId: groupDetails.groupId,
    };
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };
    try {
      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_API_URL}/api/v1/groups/update`,
        data: requestObject,
        headers: headersObject,
      });

      if (response.data.status === "success") {
        updateGroupInTable({
          name: response.data.group.name,
          teacherFullName: response.data.group.teacher.fullName,
        });
        setGroupName(response.data.group.name);

        setAlert({
          open: true,
          message: "groupName changed successfully",
          backgroundColor: "#4BB543",
        });
        handleDialogClose();
      } else {
        new Error("Something else happened");
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "groupName couldn't changed",
        backgroundColor: "#FF3232",
      });
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
      <Grid
        item
        container
        direction="row"
        alignItems="flex-end"
        spacing={2}
        style={{ marginBottom: "8px" }}
      >
        <Grid item md={6} xs={12}>
          <TextField
            id="group-name"
            label="Group name:"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setConfirmDialog({
                open: true,
                title: "Updating new group name",
                description: "Are you sure that you want to update group name",
                confirm: "Confirm",
                cancel: "Cancel",
              });
            }}
          >
            Update group name
          </Button>
        </Grid>
      </Grid>
      <Grid item container direction="row" alignItems="flex-end" spacing={2}>
        <Grid item md={6} xs={12}>
          <TextField
            id="group-teacher"
            label="Group teacher:"
            fullWidth
            value={groupTeacher}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setAssignTeacherDialog(true);
            }}
          >
            Assign new group teacher
          </Button>
        </Grid>
      </Grid>
      <Grid item container direction="row" alignItems="flex-end" spacing={2}>
        <Grid item md={3} xs={12} style={{ marginTop: "8px" }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => {
              setDeleteConfirmDialog({
                open: true,
                title: "Deleting the group",
                description: "Are you sure that you want to delete group",
                confirm: "Yes Confrim",
                cancel: "Cancel",
              });
            }}
            startIcon={<DeleteIcon />}
          >
            Delete Group
          </Button>
        </Grid>
      </Grid>
      <AssignNewTeacherDialog
        open={assignTeacherDialog}
        groupDetails={groupDetails}
        updateGroupInTable={updateGroupInTable}
        handleClose={() => {
          setAssignTeacherDialog(false);
        }}
        setAlert={setAlert}
      />
      <SimpleConfirmDialog
        handleClose={handleDialogClose}
        handleConfirm={updateGroupName}
        elements={{
          title: confirmDialog.title,
          description: confirmDialog.description,
          confirm: confirmDialog.confirm,
          cancel: confirmDialog.cancel,
        }}
        open={confirmDialog.open}
      />
      <SimpleConfirmDialog
        handleClose={handleDeleteConfirmDialogClose}
        handleConfirm={deleteGroup}
        elements={{
          title: deleteConfirmDialog.title,
          description: deleteConfirmDialog.description,
          confirm: deleteConfirmDialog.confirm,
          cancel: deleteConfirmDialog.cancel,
        }}
        open={deleteConfirmDialog.open}
      />
    </Grid>
  );
}
