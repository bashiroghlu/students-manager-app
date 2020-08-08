import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Switch, Route, Redirect } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Header from "../components/ui/SignedInHeader";
import EmployeesPage from "./employees/Employees";
import Overview from "./overview/Overview";
import Students from "./students/Students";
import MyAccount from "./my-account/MyAccount";
import StartExam from "./start-exam/StartExam";
import IeltsExams from "./ielts-exams/IeltsExams";
import EditExamResults from "./edit-exam/EditExamResults";
import PublishExamResults from "./publish-exam/PublishExamResults";
import SendEmailPage from "./send-email/SendEmailPage";
import ManageGroupPage from "./manage-group/ManageGroupPage";
import AddGroup from "./add-group/AddGroup";
import { AuthContext } from "../context/auth-context";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // maxWidth: "100%",
  },
  content: {
    maxWidth: "100%",
    flexGrow: 1,
    padding: theme.spacing(2),
    ...theme.mixins.toolbar,
  },
}));

export default function ClippedDrawer() {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  let routes;

  if (auth.status === "chief-manager") {
    routes = (
      <Switch>
        <Route exact path="/" render={(props) => <Overview />} />
        <Route exact path="/employees" render={(props) => <EmployeesPage />} />
        <Route exact path="/students" render={(props) => <Students />} />
        <Route exact path="/overview" render={(props) => <Overview />} />
        <Route exact path="/myaccount" render={(props) => <MyAccount />} />
        <Route exact path="/startliveexam" render={(props) => <StartExam />} />

        <Route exact path="/exams" render={(props) => <IeltsExams />} />
        <Route
          exact
          path="/ieltsexams/:examId"
          render={(props) => <EditExamResults />}
        />

        <Route
          exact
          path="/publish-results/:examId"
          render={(props) => <PublishExamResults />}
        />
        <Route exact path="/send-email" render={(props) => <SendEmailPage />} />
        <Route
          exact
          path="/manage-groups"
          render={(props) => <ManageGroupPage />}
        />
        <Route exact path="/add-group" render={(props) => <AddGroup />} />
        <Redirect to="/" />
      </Switch>
    );
  } else if (auth.status === "manager") {
    routes = (
      <Switch>
        <Route exact path="/" render={(props) => <Overview />} />
        <Route exact path="/students" render={(props) => <Students />} />
        <Route exact path="/overview" render={(props) => <Overview />} />
        <Route exact path="/myaccount" render={(props) => <MyAccount />} />
        <Route exact path="/startliveexam" render={(props) => <StartExam />} />
        <Route exact path="/exams" render={(props) => <IeltsExams />} />
        <Route
          exact
          path="/ieltsexams/:examId"
          render={(props) => <EditExamResults />}
        />
        <Route
          exact
          path="/publish-results/:examId"
          render={(props) => <PublishExamResults />}
        />
        <Route exact path="/send-email" render={(props) => <SendEmailPage />} />
        <Route
          exact
          path="/manage-groups"
          render={(props) => <ManageGroupPage />}
        />
        <Route exact path="/add-group" render={(props) => <AddGroup />} />
        <Redirect to="/" />
      </Switch>
    );
  } else if (auth.status === "teacher") {
    routes = (
      <Switch>
        <Route exact path="/" render={(props) => <Overview />} />
        <Route exact path="/students" render={(props) => <Students />} />
        <Route exact path="/overview" render={(props) => <Overview />} />
        <Route exact path="/myaccount" render={(props) => <MyAccount />} />
        <Route exact path="/startliveexam" render={(props) => <StartExam />} />
        <Route exact path="/exams" render={(props) => <IeltsExams />} />
        <Route
          exact
          path="/ieltsexams/:examId"
          render={(props) => <EditExamResults />}
        />
        <Route
          exact
          path="/publish-results/:examId"
          render={(props) => <PublishExamResults />}
        />
        <Route exact path="/send-email" render={(props) => <SendEmailPage />} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/" render={(props) => <Overview />} />
        <Route exact path="/overview" render={(props) => <Overview />} />
        <Route exact path="/myaccount" render={(props) => <MyAccount />} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div className={classes.root}>
      <Header />
      <main className={classes.content}>
        <Toolbar />
        {routes}
      </main>
    </div>
  );
}
