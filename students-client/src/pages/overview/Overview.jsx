import React, { useEffect, useContext, useState } from "react";
import axios from "axios";

import { Grid, Paper, Typography } from "@material-ui/core";
import BarChartIcon from "@material-ui/icons/BarChart";

import AlertsPreview from "./AlertsPreview";
import { AuthContext } from "../../context/auth-context";

export default function Overview() {
  const auth = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  let graphExamples = [];

  if (auth.status === "chief-manager") {
    graphExamples = [
      {
        id: "example-1",
        desc: "The number of total studens",
        nums: "35",
      },
      { id: "example-2", desc: "The number of employees", nums: "5" },
      {
        id: "example-3",
        desc: "Expected sallary payment for upcoming month",
        nums: "6",
      },
    ];
  }
  if (auth.status === "manager") {
    graphExamples = [
      {
        id: "example-1",
        desc: "The number of total students",
        nums: "65",
      },
      { id: "example-2", desc: "The number of total groups", nums: "5" },
      {
        id: "example-3",
        desc: "The number of exams for this month",
        nums: "10",
      },
    ];
  }
  if (auth.status === "teacher") {
    graphExamples = [
      {
        id: "example-1",
        desc: "The number of your students",
        nums: "30",
      },
      { id: "example-2", desc: "The number of your groups", nums: "8" },
      {
        id: "example-3",
        desc: "Planned exams for next week",
        nums: "14",
      },
    ];
  }
  if (auth.status === "student") {
    graphExamples = [
      {
        id: "example-1",
        desc: "The number of exams you participated",
        nums: "30",
      },
      { id: "example-2", desc: "Your average score:", nums: "6.5" },
      {
        id: "example-3",
        desc: "The number of classes you have been absent",
        nums: "6",
      },
    ];
  }

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
          url: `${process.env.REACT_APP_API_URL}/api/v1/notifications/${auth.userId}`,
          headers: headersObject,
          cancelToken: source.token,
        });

        if (response.data.status === "success") {
          setNotifications(response.data.notifications);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
        } else {
          console.log(error);
        }
      }
    }
    if (auth.status === "student") {
      getData();
    }

    return source.cancel;
  }, [auth.token, auth.userId, auth.status]);
  return (
    <Grid container direction="column">
      <Grid
        item
        container
        spacing={2}
        direction="row"
        style={{ marginBottom: "8px" }}
      >
        {graphExamples.map((graph) => (
          <Grid item md={4} xs={12} sm={6} key={graph.id}>
            <Paper style={{ padding: "8px" }}>
              <Grid container direction="column">
                <Grid item>{graph.desc}</Grid>
                <Grid item container direction="row">
                  <Grid item xs={6}>
                    <BarChartIcon style={{ width: "6em", height: "6em" }} />
                  </Grid>
                  <Grid
                    xs={6}
                    item
                    container
                    justify="center"
                    alignItems="center"
                  >
                    <Grid item>
                      <Typography variant="h1">{graph.nums}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {notifications.length > 0 && auth.status === "student" ? (
        <Grid container direction="column">
          <AlertsPreview notifications={notifications} />
        </Grid>
      ) : null}
    </Grid>
  );
}
