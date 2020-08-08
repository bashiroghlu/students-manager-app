import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import { AuthContext } from "../../context/auth-context";

const useStyles = makeStyles((theme) => ({
  menuList: {
    position: "absolute",
    backgroundColor: "white",
    zIndex: 1200,
    padding: "1em",
    boxShadow: "-1px 4px 13px -1px rgba(0,0,0,0.75)",
    minWidth: "15em",
    [theme.breakpoints.up("xs")]: {
      minWidth: "24em",
    },
    marginTop: "-1em",
  },
}));

function AutoCompleteInput(props) {
  const [userName, setUserName] = useState("");
  const [userObjects, setUserObjects] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { onClick, detailsObject } = props;
  const { url, inputName, refreshNeeded } = detailsObject;
  const classes = useStyles();
  const auth = useContext(AuthContext);

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
          cancelToken: source.token,
          url: url,
          headers: headersObject,
        });

        if (response.data.status === "success") {
          setUserObjects(response.data.data);
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
    return () => {
      source.cancel();
    };
  }, [setUserObjects, refreshNeeded, auth.token, url]);

  useEffect(() => {
    let mounted = true;
    function displayUsers() {
      if (mounted) {
        if (userName.length > 0) {
          const filteredUserObjects = userObjects.filter((user) => {
            return user.fullName.toLowerCase().includes(userName.toLowerCase());
          });

          setFilteredUsers(filteredUserObjects.slice(0, 3));
        } else {
          setFilteredUsers([]);
        }
      }
    }
    displayUsers();
    return () => {
      mounted = false;
    };
  }, [userName, userObjects]);

  return (
    <>
      <TextField
        id="user-name"
        label={inputName}
        variant="outlined"
        fullWidth
        value={userName}
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />
      {filteredUsers.length > 0 && userName.length > 0 ? (
        <MenuList htmlFor="user-name" className={classes.menuList}>
          {filteredUsers.map((userObject) => (
            <MenuItem
              key={userObject._id}
              onClick={() => {
                onClick({
                  id: userObject._id,
                  fullName: userObject.fullName,
                  email: userObject.email,
                });
                setUserName("");
              }}
            >
              {userObject.fullName}
            </MenuItem>
          ))}
        </MenuList>
      ) : null}
    </>
  );
}

export default AutoCompleteInput;
