import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import SimpleTableForIeltsExams from "./SimpleTableForIeltsExams";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import SimpleConfirmDialog from "../../components/ui/SimpleConfirmDialog";

// import SimpleTable from "../../components/ui/SimpleTable";
import Select from "../../components/ui/small-components/Select";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles({
  noStudentAlert: {
    textAlign: "center",
  },
  manageBox: {
    padding: "1em",
    marginBottom: "2em",
  },
});

export default function IeltsExams() {
  const history = useHistory();
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const stageSelectOptions = [
    { label: "Ongoing exams", value: "ongoing" },
    { label: "Published exams", value: "published" },
  ];
  const typeSelectOptions = [
    { label: "IELTS", value: "IELTS" },
    { label: "General", value: "general" },
  ];

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const [examStageValue, setExamStageValue] = useState("ongoing");
  const [examTypeValue, setExamTypeValue] = useState("IELTS");
  const [exams, setExams] = useState([]);
  const [refreshNeeded, setRefreshNeeded] = useState(false);
  const [filteredExams, setFilteredExams] = useState([]);
  const [archiveConfirmDialog, setArchiveConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirm: "",
    cancel: "",
  });
  const handleArchiveConfirmDialogClose = () => {
    setArchiveConfirmDialog({
      ...archiveConfirmDialog,
      open: false,
    });
  };

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
          url: `${process.env.REACT_APP_API_URL}/api/v1/exams`,
          headers: headersObject,
          cancelToken: source.token,
        });

        if (response.data.status === "success") {
          setExams(response.data.exams);
          setLoading(false);
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
  }, [refreshNeeded, auth.token]);

  async function archiveExam() {
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };
    try {
      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_API_URL}/api/v1/exams/archive-exam/${selected}`,
        data: {},
        headers: headersObject,
      });

      if (response.data.status === "success") {
        setAlert({
          open: true,
          message: "exam archived successfully",
          backgroundColor: "#4BB543",
        });
        setRefreshNeeded(!refreshNeeded);
        setSelected(false);
        handleArchiveConfirmDialogClose();
      }
    } catch (error) {
      console.log(error);

      setAlert({
        open: true,
        message: "Exam couldn't archived",
        backgroundColor: "#FF3232",
      });
    }
  }

  useEffect(() => {
    setFilteredExams([
      ...exams.filter(
        (exam) => exam.stage === examStageValue && exam.type === examTypeValue
      ),
    ]);
  }, [examStageValue, examTypeValue, exams, setFilteredExams]);

  const tableHeaderOptions = [
    { name: "#" },
    { name: "Exam name" },
    { name: "The number of participants" },
  ];

  const moveToEditPage = (examId) => {
    history.push(`/ieltsexams/${examId}`);
  };

  function moveToPublishPage(examId) {
    history.push(`/publish-results/${examId}`);
  }

  /*   const handleClick = () => {
    setOpen(false);
  }; */

  return (
    <Grid container direction="column">
      <Grid item xs component={Paper} className={classes.manageBox}>
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item md={4} xs={12} sm={6}>
            <Select
              options={typeSelectOptions}
              id="exams-type"
              label="Choose exam type"
              value={examTypeValue}
              handleChange={(event) => setExamTypeValue(event.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item md={4} xs={12} sm={6}>
            <Select
              options={stageSelectOptions}
              id="exams-stage"
              label="Choose exam stage"
              value={examStageValue}
              handleChange={(event) => setExamStageValue(event.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" item spacing={2}>
          <Grid item md={4} xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                moveToEditPage(selected);
                setSelected(false);
              }}
              disabled={!selected}
            >
              Update Results
            </Button>
          </Grid>
          <Grid item md={4} xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              disabled={!selected}
              onClick={() => {
                setArchiveConfirmDialog({
                  open: true,
                  title: "Archive exam",
                  description: "Are you sure that you want to archive exam",
                  confirm: "Confirm",
                  cancel: "Cancel",
                });
              }}
            >
              archive
            </Button>
          </Grid>
          <Grid item md={4} xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                moveToPublishPage(selected);

                setSelected(false);
              }}
              disabled={!selected}
            >
              Publish
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {loading ? (
        <Grid
          style={{ minHeight: "40vh" }}
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
          {filteredExams.length <= 0 ? (
            <Typography variant="subtitle1" className={classes.noStudentAlert}>
              There is no exam with provided options
            </Typography>
          ) : (
            <TableContainer>
              <SimpleTableForIeltsExams
                selected={selected}
                setSelected={setSelected}
                tableHeaderOptions={tableHeaderOptions}
                rows={filteredExams}
                checkbox
              />
            </TableContainer>
          )}
        </Grid>
      )}
      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={2000}
      />
      <SimpleConfirmDialog
        handleClose={handleArchiveConfirmDialogClose}
        handleConfirm={archiveExam}
        elements={{
          title: archiveConfirmDialog.title,
          description: archiveConfirmDialog.description,
          confirm: archiveConfirmDialog.confirm,
          cancel: archiveConfirmDialog.cancel,
        }}
        open={archiveConfirmDialog.open}
      />
    </Grid>
  );
}
