import React, { useState, useContext } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AuthContext } from "../../../context/auth-context";

export default function UpdatePasswordDialog(props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { handleClose, open, setAlert, setLoading } = props;

  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("sm"));
  const auth = useContext(AuthContext);

  async function updatePassword() {
    const requestObject = {
      currentPassword,
      password,
      passwordConfirm,
    };
    const headersObject = {
      "Content-Type": "application/json",
      authorization: "Bearer " + auth.token,
    };
    setLoading(true);
    try {
      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_API_URL}/api/v1/auth/updatePassword`,
        data: requestObject,
        headers: headersObject,
      });

      if (response.data.status === "success") {
        setAlert({
          open: true,
          message: "Password changed successfully",
          backgroundColor: "#4BB543",
        });
        auth.login({
          token: response.data.token,
          id: response.data.user.id,
          notifications: response.data.user.notifications,
          fullName: response.data.user.fullName,
          status: response.data.user.status,
        });
        setLoading(false);
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response.data.message,
        backgroundColor: "#FF3232",
      });
      setLoading(false);
    }
  }

  return (
    <Dialog
      fullScreen={matchesMD}
      open={open}
      onClose={handleClose}
      aria-labelledby="password-change-form"
    >
      <DialogTitle id="password-change-form">Change Password</DialogTitle>
      <DialogContent>
        <Grid
          container
          // fullwidth="md"
          style={{ padding: "1em" }}
          spacing={2}
        >
          <Grid item xs={12}>
            <TextField
              id="current-password"
              label="Current Pasword"
              type="password"
              fullWidth
              onChange={(event) => setCurrentPassword(event.target.value)}
              value={currentPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="new-password"
              label="New Password"
              type="password"
              fullWidth
              onChange={(event) => setPassword(event.target.value)}
              value={password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="confirm-password"
              label="Confirm New Password"
              type="password"
              fullWidth
              onChange={(event) => setPasswordConfirm(event.target.value)}
              value={passwordConfirm}
            />
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
            handleClose();
            updatePassword();
          }}
        >
          Update Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}
