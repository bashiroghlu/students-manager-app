import React from "react";
import Header from "../components/ui/Header";
import { Switch, Route, Redirect } from "react-router-dom";

import SignIn from "./sign-in/SignIn";


export default function LandingPage() {
  return (
    <div>
      <Header />
      <Switch>
        {/* <Route exact path="/" render={(props) => <SignIn />} /> */}
        <Route exact path="/login" render={(props) => <SignIn />} />
        <Redirect to="/login" />
      </Switch>
    </div>
  );
}
