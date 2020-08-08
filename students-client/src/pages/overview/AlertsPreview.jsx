import React from "react";
import { Grid, Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Link } from "react-router-dom";

function AlertsPreview(props) {
  const { notifications } = props;
  return (
    <Grid item sm={12}>
      {notifications.map(({ _id, message, type, link }) => (
        <Alert severity={type} key={_id}>
          <AlertTitle>{type.toUpperCase()}</AlertTitle>
          {message}
          {link ? (
            <Button to={link} component={Link} color="primary">
              Check it out
            </Button>
          ) : null}
        </Alert>
      ))}
    </Grid>
  );
}

export default AlertsPreview;
