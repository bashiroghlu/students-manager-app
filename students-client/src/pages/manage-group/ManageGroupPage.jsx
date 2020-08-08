import React, { useState } from "react";
import AutoCompleteInputGroupNames from "../../components/ui/AutoCompleteInputGroupNames";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import ManageStudents from "./ManageStudents";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Snackbar from "@material-ui/core/Snackbar";

import ManageGroupDetails from "./ManageGroupDetails";

const useStyles = makeStyles((theme) => ({
  mainWrapper: {
    padding: "1em",
  },
}));

export default function ManageGroupDetailsPage() {
  const classes = useStyles();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const [tabValue, setTabValue] = useState(false);
  const [refreshNeeded, setRefreshNeeded] = useState(false);

  const [groupDetails, setGroupDetails] = useState({
    groupName: "",
    groupTeacher: "",
    grupMembersNum: "",
    groupId: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });

  const tabsOptions = [
    {
      label: "manage students",
      value: "manage-students",
      id: "manage-students",
    },
    { label: "manage group", value: "manage-group", id: "manage-group" },
    // { label: "Assign new teacher", value: "assign-new-teacher" },
  ];

  function handleTabChange(_, newValue) {
    setTabValue(newValue);
  }

  function addGroupToTable({ name, teacherFullName, num, groupId }) {
    setGroupDetails({
      groupName: name,
      groupTeacher: teacherFullName,
      grupMembersNum: num,
      groupId: groupId,
    });
  }

  function updateGroupInTable({ name, teacherFullName }) {
    setGroupDetails({
      ...groupDetails,
      groupName: name,
      groupTeacher: teacherFullName,
    });
  }
  function resetGroupPage() {
    setGroupDetails({
      groupName: "",
      groupTeacher: "",
      grupMembersNum: "",
      groupId: "",
    });
    setTabValue(false);
    setRefreshNeeded(!refreshNeeded);
  }

  return (
    <Grid container direction="column" justify="space-between">
      <Grid
        item
        container
        className={classes.mainWrapper}
        component={Paper}
        // gutterBottom={2}
        style={{ marginBottom: "1em" }}
        direction="column"
      >
        <Grid
          item
          container
          direction="row"
          style={{ marginBottom: "1em" }}
          spacing={2}
          alignItems="flex-end"
        >
          <Grid item md={4} xs={12}>
            <AutoCompleteInputGroupNames
              onClick={addGroupToTable}
              detailsObject={{
                url: `${process.env.REACT_APP_API_URL}/api/v1/groups`,
                inputName: "Provide group names",
              }}
              refreshNeeded={refreshNeeded}
            />
          </Grid>

          <Grid
            container
            item
            md={8}
            xs={12}
            direction="row"
            spacing={matchesXS ? 1 : 0}
          >
            <Grid item sm={4} xs={12}>
              <TextField
                id="standard-read-only-input-1"
                label="Group name"
                // defaultValue=""
                fullWidth
                disabled
                value={groupDetails.groupName}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField
                id="standard-read-only-input-2"
                label="Group teacher"
                // defaultValue=""
                fullWidth
                disabled
                value={groupDetails.groupTeacher}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField
                id="standard-read-only-input-3"
                label="the number of members"
                fullWidth
                disabled
                value={groupDetails.grupMembersNum}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item container direction="row" spacing={2}>
          <Grid item xs={12}>
            <Tabs
              value={tabValue}
              indicatorColor="primary"
              textColor="primary"
              aria-label="disabled tabs example"
              variant="fullWidth"
              onChange={handleTabChange}
            >
              {tabsOptions.map((tab) => (
                <Tab
                  key={tab.id}
                  label={tab.label}
                  disabled={groupDetails.groupName.length <= 0}
                  // style={{ color: "blue" }}
                />
              ))}
            </Tabs>
          </Grid>
        </Grid>
      </Grid>
      {tabValue === 0 ? (
        <ManageStudents groupId={groupDetails.groupId} setAlert={setAlert} />
      ) : tabValue === 1 ? (
        <ManageGroupDetails
          setAlert={setAlert}
          groupDetails={groupDetails}
          updateGroupInTable={updateGroupInTable}
          addGroupToTable={addGroupToTable}
          resetGroupPage={resetGroupPage}
        />
      ) : null}
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
