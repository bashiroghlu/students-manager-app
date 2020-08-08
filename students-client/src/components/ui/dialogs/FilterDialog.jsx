import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AuthContext } from "../../../context/auth-context";
import { Typography } from "@material-ui/core";

export default function FilterDialog(props) {
  const [teacherValue, setTeacherValue] = useState("Not choosen");
  const [teachers, setTeachers] = useState([]);

  const { handleClose, open, setAlert, onClick } = props;

  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("xs"));
  const auth = useContext(AuthContext);

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
          url: `${process.env.REACT_APP_API_URL}/api/v1/users/teacherEmails`,
          headers: headersObject,
          cancelToken: source.token,
        });

        if (response.data.status === "success") {
          const teachers = response.data.data.map((teacher) => ({
            id: teacher._id,
            name: teacher.fullName,
          }));

          setTeachers(teachers);

          // setUserObjects(response.data.data);
        } else {
          new Error("Something else happened");
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
  }, [auth.token]);

  function resetSelects() {
    setTeacherValue("Not choosen");
  }

  return (
    <Dialog
      fullScreen={matchesSM}
      open={open}
      onClose={handleClose}
      aria-labelledby="password-change-form"
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogTitle id="password-change-form">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>Apply filter for students</Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            // className={classes.button}
            onClick={resetSelects}
            startIcon={<ClearAllIcon />}
          >
            Reset
          </Button>
        </div>
      </DialogTitle>
      <DialogContent>
        <Grid container style={{ padding: "1em" }} spacing={2}>
          <Grid item xs={12} sm={8} md={5}>
            <TextField
              fullWidth
              id="standard-select-teacher"
              select
              label="Teacher name"
              value={teacherValue}
              onChange={(event) => {
                setTeacherValue(event.target.value);
              }}
              helperText="Please select teacher"
            >
              {[...teachers, { id: "Not choosen", name: "Not choosen" }].map(
                (option) => (
                  <MenuItem key={option.id} value={option.name}>
                    {option.name}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            onClick({ teacherName: teacherValue });
            setAlert({
              open: true,
              message: "Filter applied successfully",
              backgroundColor: "#4BB543",
            });
          }}
        >
          Apply filter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
