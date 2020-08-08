import React, { useState, useContext, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import UpdatePasswordDialog from "../../components/ui/dialogs/UpdatePasswordDialog";

import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { AuthContext } from "../../context/auth-context";
import UserDetails from "./UserDetails";
import SimpleConfirmDialog from "../../components/ui/SimpleConfirmDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
}));

export default function SimplePaper() {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [dialogState, setDialogState] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirm: "",
    cancel: "",
  });
  const [userDetails, setUserDetails] = useState({
    name: "",
    surname: "",
    email: "",
    gender: "",
    birthDate: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });

  useEffect(() => {
    setLoading(true);
    const source = axios.CancelToken.source();
    async function getData() {
      const headersObject = {
        "Content-Type": "application/json",
        authorization: "Bearer " + auth.token,
      };

      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/api/v1/users/me/${auth.userId}`,
          headers: headersObject,
          cancelToken: source.token,
        });

        if (response.data.status === "success") {
          setUserDetails({
            name: response.data.user.name,
            surname: response.data.user.surname,
            gender: response.data.user.gender,
            email: response.data.user.email,
            birthDate: response.data.user.birthDate
              ? moment(new Date(response.data.user.birthDate)).format(
                  "YYYY-MM-DD"
                )
              : "",
          });
          setLoading(false);
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
  }, [auth.userId, auth.token]);

  function openUpdateDetailsDialog() {
    setDialogState("updateUserDetails");
    setConfirmDialog({
      open: true,
      title: "Updating user Details",
      description: "Are you sure that you want to update your data",
      confirm: "Yes, I Confirm",
      cancel: "Cancel",
    });
  }
  function closeSimpleDialog() {
    setConfirmDialog({
      ...confirmDialog,
      open: false,
    });
  }

  async function updateDetails() {
    closeSimpleDialog();
    const requestObject = {
      userId: auth.userId,
      ...userDetails,
    };

    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };
    if (!requestObject.birthDate) {
      return setAlert({
        open: true,
        message: "Please check birthdate before update",
        backgroundColor: "#FF3232",
      });
    }

    try {
      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_API_URL}/api/v1/users/updateUserDetails`,
        data: requestObject,
        headers: headersObject,
      });

      if (response.data.status === "success") {
        setAlert({
          open: true,
          message: "User data updated",
          backgroundColor: "#4BB543",
        });
        closeSimpleDialog();
      } else {
        new Error("Something else happened");
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "User data couldn't updated",
        backgroundColor: "#FF3232",
      });
      closeSimpleDialog();
    }
  }

  return (
    <>
      {loading ? (
        <Grid
          style={{ minHeight: "80vh" }}
          container
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        <Grid container className={classes.root} direction="column">
          <Grid
            item
            container
            direction="column"
            component={Paper}
            style={{ padding: "1em", marginBottom: "2em" }}
          >
            <UserDetails
              userDetails={userDetails}
              setUserDetails={setUserDetails}
              openUpdateDetailsDialog={openUpdateDetailsDialog}
            />
          </Grid>
          <Grid
            item
            container
            direction="column"
            component={Paper}
            style={{ padding: "1em" }}
          >
            <Grid
              item
              container
              direction="row"
              spacing={2}
              alignItems="flex-end"
            >
              <Grid item md={4} xs={12}>
                <TextField
                  id="email"
                  label="Your Email"
                  disabled
                  fullWidth
                  value={userDetails.email}
                />
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => {
                    setAlert({
                      open: true,
                      message:
                        "You cannot update email since I haven't implement that feature, keep in touch, you will be able soon",
                      backgroundColor: "#FFC107",
                    });
                  }}
                >
                  Update Email
                </Button>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => setDialogState("updatePassword")}
                >
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <SimpleConfirmDialog
            handleClose={closeSimpleDialog}
            elements={{
              title: confirmDialog.title,
              description: confirmDialog.description,
              confirm: confirmDialog.confirm,
              cancel: confirmDialog.cancel,
            }}
            handleConfirm={updateDetails}
            open={confirmDialog.open}
          />

          <UpdatePasswordDialog
            handleClose={() => setDialogState("")}
            open={dialogState === "updatePassword"}
            setAlert={setAlert}
            setLoading={setLoading}
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
      )}
    </>
  );
}
