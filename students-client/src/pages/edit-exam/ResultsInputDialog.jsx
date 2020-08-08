import React, { useState, useContext } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { AuthContext } from "../../context/auth-context";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
}));

export default function ResultsInputDialog(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const {
    updateStudentResults,
    setAlert,
    dataInputDialogOpen,
    selected,
    closeDataInputDialog,
  } = props;

  const [result, setResult] = useState({
    resultWritingOne: selected.resultWritingOne,
    resultWritingTwo: selected.resultWritingTwo,
    resultReading: selected.resultReading,
    resultSpeaking: selected.resultSpeaking,
    resultListening: selected.resultListening,
  });
  async function updateUserResults() {
    function normailizeResult(value) {
      if (value >= 40) {
        return 9;
      } else if (30 < value && value < 40) {
        return 7.5;
      } else if (20 < value && value < 30) {
        return 6;
      } else if (0 < value && value < 10) {
        return value;
      } else {
        return 5;
      }
    }

    const requestObject = {
      resultWritingOne: result.resultWritingOne,
      resultWritingTwo: result.resultWritingTwo,
      resultSpeaking: result.resultSpeaking,
      resultReading: normailizeResult(result.resultReading),
      resultListening: normailizeResult(result.resultListening),
      participantId: selected.participant._id,
    };
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/v1/exams/updateResult`,
        data: requestObject,
        headers: headersObject,
      });

      if (response.data.status === "success") {
        const participant = response.data.exam.participants.find(
          (participant) => participant.participant === selected.participant._id
        );
        updateStudentResults(participant);

        closeDataInputDialog();

        setAlert({
          open: true,
          message: "User's results updated successfully",
          backgroundColor: "#4BB543",
        });
      } else {
        new Error("Something else happened");
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "User's results couldn't updated",
        backgroundColor: "#FF3232",
      });
    }
  }

  return (
    <React.Fragment>
      <Dialog
        maxWidth="md"
        open={dataInputDialogOpen}
        onClose={closeDataInputDialog}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle>
        <DialogContent>
          <DialogContentText>Provide Student's results</DialogContentText>
          <form className={classes.form}>
            <Grid container spacing={2}>
              <Grid
                item
                container
                direction="row"
                spacing={2}
                justify="space-around"
              >
                <Grid item>
                  <TextField
                    // style={{ width: "10em" }}
                    id="result-resultWritingOne"
                    label="Writing One"
                    type="number"
                    variant="outlined"
                    onChange={(event) =>
                      setResult({
                        ...result,
                        resultWritingOne: event.target.value,
                      })
                    }
                    value={result.resultWritingOne}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    // style={{ width: "10em" }}
                    id="result-resultWritingTwo"
                    label="Writing Two"
                    type="number"
                    variant="outlined"
                    onChange={(event) =>
                      setResult({
                        ...result,
                        resultWritingTwo: event.target.value,
                      })
                    }
                    value={result.resultWritingTwo}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    // style={{ width: "10em" }}
                    id="result-Reading"
                    label="Reading"
                    type="number"
                    variant="outlined"
                    onChange={(event) =>
                      setResult({
                        ...result,
                        resultReading: event.target.value,
                      })
                    }
                    value={result.resultReading}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    // style={{ width: "10em" }}
                    id="result-Listening"
                    label="Listening"
                    type="number"
                    variant="outlined"
                    onChange={(event) =>
                      setResult({
                        ...result,
                        resultListening: event.target.value,
                      })
                    }
                    value={result.resultListening}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    // style={{ width: "10em" }}
                    id="result-Speaking"
                    label="Speaking"
                    type="number"
                    variant="outlined"
                    onChange={(event) =>
                      setResult({
                        ...result,
                        resultSpeaking: event.target.value,
                      })
                    }
                    value={result.resultSpeaking}
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={updateUserResults}
            variant="contained"
            color="primary"
          >
            Submit data
          </Button>
          <Button onClick={closeDataInputDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
