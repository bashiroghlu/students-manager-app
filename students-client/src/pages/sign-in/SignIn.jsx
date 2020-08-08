import React, { useContext, useState } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import { AuthContext } from "../../context/auth-context";

export default function SignIn() {
  const auth = useContext(AuthContext);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  async function submitLogin() {
    setLoading(true);
    if (!(email.length >= 10) || !(password.length >= 6)) {
      return setAlert({
        open: true,
        message: "please check credentials",
        backgroundColor: "#FF3232",
      });
    }
    const requestObject = {
      email: email,
      password: password,
    };

    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/v1/auth/login`,
        data: requestObject,
      });
      if (response.data.token && response.data.user.id) {
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
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ paddingTop: "8em" }}
    >
      <Grid
        item
        container
        direction="row"
        justify="center"
        style={{ marginBottom: "2em" }}
      >
        <Grid item xs={10} sm={6} md={3}>
          <TextField
            id="email"
            label="Email:"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            variant="outlined"
            type="text"
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="row"
        justify="center"
        style={{ marginBottom: "2em" }}
      >
        <Grid item xs={10} sm={6} md={3}>
          <TextField
            id="password"
            label="Password:"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            variant="outlined"
            type="password"
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid item container direction="row" justify="center">
        <Grid item xs={10} sm={6} md={3}>
          {loading ? (
            <Grid
              style={{ minHeight: "20vh" }}
              container
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          ) : (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={submitLogin}
            >
              Log in
            </Button>
          )}
        </Grid>
      </Grid>
      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={alert.timeout || 2000}
      />
    </Grid>
  );
}
