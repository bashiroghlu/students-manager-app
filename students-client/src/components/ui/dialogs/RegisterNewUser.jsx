import React, { useContext } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import AutoCompleteInput from "../AutoCompleteInput";
import { AuthContext } from "../../../context/auth-context";

export default function RegisterNewUser(props) {
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("sm"));
  const auth = useContext(AuthContext);
  const { open, toggleRegisterDialog, setAlert, toggleRefresh } = props;
  const [user, setUserDetails] = React.useState({
    email: "",
    name: "",
    surname: "",
    teacherId: "",
    teacherFullName: "",
  });

  function confirmUserRegister({ id, fullName }) {
    setUserDetails({
      ...user,
      teacherId: id,
      teacherFullName: fullName,
    });
  }

  async function createUser() {
    if (
      user.name === "" ||
      user.email === "" ||
      user.surname === "" ||
      user.teacherId === "" ||
      user.teacherFullName === ""
    ) {
      return setAlert({
        open: true,
        message: "Please check user details again or cancel operation",
        backgroundColor: "#FF3232",
      });
    }
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };
    const requestObject = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      teacher: user.teacherId,
    };

    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/v1/users/`,
        data: requestObject,
        headers: headersObject,
      });

      const { fullName } = response.data.user;

      if (response.data.status === "success") {
        setAlert({
          open: true,
          message: `${fullName} named user registered successfully`,
          backgroundColor: "#4BB543",
        });
        toggleRegisterDialog();
        toggleRefresh();
        setUserDetails({
          email: "",
          name: "",
          surname: "",
          teacherId: "",
          teacherFullName: "",
        });
      }
    } catch (error) {
      console.log(error);
      setAlert({
        open: true,
        message: "User could not registered",
        backgroundColor: "#FF3232",
      });
      setUserDetails({
        email: "",
        name: "",
        surname: "",
        teacherId: "",
        teacherFullName: "",
      });
      toggleRegisterDialog();
    }
  }

  return (
    <Grid>
      <Dialog
        fullScreen={matchesMD}
        open={open}
        onClose={toggleRegisterDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Register new user</DialogTitle>
        <DialogContent>
          <Grid
            container
            // fullwidth="md"
            style={{ padding: "1em" }}
            spacing={2}
          >
            <Grid item xs={12}>
              <AutoCompleteInput
                onClick={confirmUserRegister}
                detailsObject={{
                  url: `${process.env.REACT_APP_API_URL}/api/v1/users/teacherEmails`,
                  inputName: "add student's teacher name",
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="surname"
                value={user.teacherFullName}
                onChange={(event) =>
                  setUserDetails({
                    ...user,
                    teacherFullName: event.target.value,
                  })
                }
                InputProps={{
                  readOnly: true,
                }}
                label="student's teacher name"
                fullWidth
                type="text"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="email"
                label="add user's email"
                value={user.email}
                onChange={(event) =>
                  setUserDetails({ ...user, email: event.target.value })
                }
                type="email"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(event) =>
                  setUserDetails({ ...user, name: event.target.value })
                }
                id="name"
                label="add student's name"
                fullWidth
                type="text"
                value={user.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(event) =>
                  setUserDetails({ ...user, surname: event.target.value })
                }
                id="name"
                label="add student's surname"
                fullWidth
                type="text"
                value={user.surname}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleRegisterDialog} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              createUser();
            }}
          >
            Confirm Registration
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
