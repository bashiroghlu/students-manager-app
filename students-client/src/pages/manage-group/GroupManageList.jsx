import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 300,
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

  const { items, checkedStudent, setCheckedStudent } = props;
 

  return (
    <List dense className={classes.root}>
      {items.length > 0 ? (
        items.map((item) => {
          // const labelId = `checkbox-list-secondary-label-${value}`;
          return (
            <ListItem key={item._id} button>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${1 + 1}`}
                  src={`/static/images/avatar/${1 + 1}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText>
                <Typography>{item.name + " " + item.surname}</Typography>
              </ListItemText>
              {/* primary={item} */}
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  onChange={() => setCheckedStudent(item._id)}
                  checked={checkedStudent === item._id}
                  /* checked={checked.indexOf(value) !== -1}
                inputProps={{ "aria-labelledby": labelId }} */
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })
      ) : (
        <Typography variant="subtitle1" className={classes.noStudentAlert}>
          There is no student in this group
        </Typography>
      )}
    </List>
  );
}
