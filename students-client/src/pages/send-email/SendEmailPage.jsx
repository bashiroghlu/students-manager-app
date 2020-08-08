import React, { useState, useContext } from "react";
import axios from "axios";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import DeleteIcon from "@material-ui/icons/Delete";
import Snackbar from "@material-ui/core/Snackbar";
import AutoCompleteInput from "../../components/ui/AutoCompleteInput";
import AutoCompleteInputGroupNames from "../../components/ui/AutoCompleteInputGroupNames";
import Select from "../../components/ui/small-components/Select";
import List from "../../components/ui/small-components/List";
import SimpleConfirmDialog from "../../components/ui/SimpleConfirmDialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AuthContext } from "../../context/auth-context";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: "1em",
  },
}));

export default function LayoutTextFields() {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const theme = useTheme();
  const SelectOptions = [
    { label: "Add Student", value: "add-student" },
    { label: "Add Group", value: "add-group" },
  ];

  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const [sendEmailConfirmDialog, setSendEmailConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirm: "",
    cancel: "",
  });

  const handleSendEmailDialogClose = () => {
    setSendEmailConfirmDialog({
      ...sendEmailConfirmDialog,
      open: false,
    });
  };
  const [message, setMessage] = useState(
    "Əziz tələbələr bu  gün, yəni 17 07 2020 də dərs olmayacaq. Təşəkkürlər anlayışınız üçün."
  );
  const [checkedStudent, setCheckedStudent] = useState("");
  const [selectValue, setSelectValue] = useState("add-student");
  const [studentsInTable, setStudentsInTable] = useState([]);

  async function sendEmails(students) {
    handleSendEmailDialogClose();
    const studentsObjs = students.map((student) => {
      return {
        studentEmail: student.email,
        message: message,
      };
    });
    const requestObject = {
      students: studentsObjs,
      message,
    };
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/v1/users/emails`,
        data: requestObject,
        headers: headersObject,
      });

      if (response.data.status === "success") {
        setAlert({
          open: true,
          message: "Emails are sent successfully",
          backgroundColor: "#4BB543",
        });
        setMessage("");
        setStudentsInTable([]);
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Emails couldn't sent successfully",
        backgroundColor: "#FF3232",
      });
    }
  }

  function toggleCheckbox(item) {
    if (item === checkedStudent) {
      setCheckedStudent("");
    } else {
      setCheckedStudent(item);
    }
  }

  function addStudentToList({ id, fullName, email }) {
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

  function addStudentToListInGroup({ groupId }) {
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
        });

        if (response.data.status === "success") {
          return response.data.data.students;
        } else {
          new Error("Something else happened");
        }
      } catch (error) {
        console.log(error);
      }
    }

    getData().then((students) => {
      const ArrayToAdd = [];
      students.map((student) => {
        const isStudentExistInTable = studentsInTable.find(
          (studentInTable) => studentInTable.id === student._id
        );

        if (isStudentExistInTable) {
          return false;
        }

        return ArrayToAdd.push({
          id: student._id,
          fullName: student.fullName,
          email: student.email,
        });
      });
      setStudentsInTable([...studentsInTable, ...ArrayToAdd]);
    });
  }

  return (
    <Grid
      container
      direction="row"
      component={Paper}
      className={classes.root}
      justify="space-between"
    >
      <Grid container direction="row" spacing={2}>
        <Grid item md={8} container>
          <Grid
            container
            spacing={2}
            direction={matchesSM ? "column" : "row"}
            style={{ marginBottom: "0.25em" }}
          >
            <Grid item md={5}>
              <Select
                options={SelectOptions}
                id="adding-option"
                label="Choose what you want to add"
                // helperText=""
                value={selectValue}
                variant="outlined"
                fullWidth
                handleChange={(event) => setSelectValue(event.target.value)}
              />
            </Grid>
            <Grid item md={7}>
              {selectValue === "add-student" ? (
                <AutoCompleteInput
                  onClick={addStudentToList}
                  detailsObject={{
                    url: `${process.env.REACT_APP_API_URL}/api/v1/users/emails`,
                    inputName: "Provide student name",
                  }}
                />
              ) : (
                <AutoCompleteInputGroupNames
                  onClick={addStudentToListInGroup}
                  detailsObject={{
                    url: `${process.env.REACT_APP_API_URL}/api/v1/groups`,
                    inputName: "Provide group name",
                  }}
                />
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ padding: "8px 0" }}>
            <TextField
              id="email-message"
              label="Add your message"
              multiline
              rows={13}
              variant="outlined"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid item md={4} xs={12}>
          <List
            items={studentsInTable}
            checkedStudent={checkedStudent}
            setCheckedStudent={toggleCheckbox}
            height={377}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        justify="space-between"
        style={matchesSM ? { paddingTop: "8px" } : null}
        direction={matchesXS ? "column-reverse" : "row"}
      >
        <Grid item xs sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => {
              setSendEmailConfirmDialog({
                open: true,
                title: "Students to send email",
                description: "Are you sure that you want to send emails ",
                confirm: "Confirm",
                cancel: "Cancel",
              });
            }}
          >
            Send Email
          </Button>
        </Grid>
        <Grid item xs sm={4}>
          {checkedStudent && (
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<DeleteIcon className={classes.deleteIcon} />}
              onClick={deleteStudent}
              fullWidth
            >
              Delete
            </Button>
          )}
        </Grid>
      </Grid>
      <SimpleConfirmDialog
        handleClose={handleSendEmailDialogClose}
        handleConfirm={() => {
          sendEmails(studentsInTable);
        }}
        elements={{
          title: sendEmailConfirmDialog.title,
          description: sendEmailConfirmDialog.description,
          confirm: sendEmailConfirmDialog.confirm,
          cancel: sendEmailConfirmDialog.cancel,
        }}
        open={sendEmailConfirmDialog.open}
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
