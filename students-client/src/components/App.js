import React, { useState, useCallback, useEffect } from "react";

import { ThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { BrowserRouter, Switch } from "react-router-dom";
import theme from "./ui/Theme";

import Dashboard from "../pages/Dashboard";
import LandingPage from "../pages/LandingPage";
import { AuthContext } from "../context/auth-context";

function App() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [userStatus, setUserStatus] = useState("");

  const login = useCallback(
    ({ token, id, notifications, fullName, status }) => {
      setToken(token);
      setUserId(id);
      setUserFullName(fullName);
      setUserStatus(status);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: id,
          token: token,
          fullName: fullName,
          status: status,
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUserFullName(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login({
        token: storedData.token,
        id: storedData.userId,
        notifications: [],
        fullName: storedData.fullName,
        status: storedData.status,
      });
    }
    setLoading(false);
  }, [login]);

  const signedInComponents = (
    <React.Fragment>
      <Dashboard />
    </React.Fragment>
  );
  const signedOutComponents = (
    <React.Fragment>
      <Switch>
        <LandingPage />
      </Switch>
    </React.Fragment>
  );
  if (loading) {
    return (
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
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLogggedIn: !!token,
        token,
        login,
        logout,
        userId,
        fullName: userFullName,
        status: userStatus,
      }}
    >
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {token ? signedInComponents : signedOutComponents}
        </BrowserRouter>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
