import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
// import Theme from '../Theme'

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: 600,
    overflowY: "auto",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4,
    border: "1px solid #bdbdbd",

    [theme.breakpoints.down("md")]: {
      marginTop: "0",
      marginRight: "0",
      padding: "0px",
    },
  },
  noStudentAlert: {
    textAlign: "center",
  },
}));

export default function CheckboxListSecondary(props) {
  const classes = useStyles();

  const { items, checkedStudent, setCheckedStudent, height } = props;

  return (
    <List dense className={classes.root} style={{ height: height }}>
      {items.length > 0 ? (
        items.map((item) => {
          return (
            <ListItem key={item.id} button>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${1 + 1}`}
                  src={`/static/images/avatar/${1 + 1}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText>
                <Typography>{item.fullName}</Typography>
                <Typography>{item.email}</Typography>
              </ListItemText>

              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  onChange={() => setCheckedStudent(item.id)}
                  checked={checkedStudent === item.id}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })
      ) : (
        <Typography variant="subtitle1" className={classes.noStudentAlert}>
          There is no student
        </Typography>
      )}
    </List>
  );
}
