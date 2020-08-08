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

function AutoCompleteInputGroupNames(props) {
  const [groupName, setGroupName] = useState("");
  const [groupNames, setGroupNames] = useState([]);
  const [filteredGroupNames, setFilteredGroupNames] = useState([]);
  const { onClick, detailsObject, refreshNeeded } = props;
  const { url, inputName } = detailsObject;
  const auth = useContext(AuthContext);

  const classes = useStyles();
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
          url: url,
          headers: headersObject,
          cancelToken: source.token,
        });

        if (response.data.status === "success") {
          setGroupNames(response.data.data);
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
    return source.cancel;
  }, [setGroupNames, refreshNeeded, auth.token, url]);

  useEffect(() => {
    function displayGroups() {
      if (groupName.length > 0) {
        const groupNameObjects = groupNames.filter((groupNameObject) => {
          return groupNameObject.name
            .toLowerCase()
            .includes(groupName.toLowerCase());
        });
        setFilteredGroupNames(groupNameObjects);
      } else {
        setFilteredGroupNames([]);
      }
    }
    displayGroups();
    return () => {
      setFilteredGroupNames(groupNames);
    };
  }, [groupName, groupNames]);

  return (
    <>
      <TextField
        id="search-data"
        label={inputName}
        value={groupName}
        onChange={(event) => setGroupName(event.target.value)}
        // defaultValue="Default Value"
        // helperText="Some important text"
        variant="outlined"
        fullWidth
      />
      {filteredGroupNames.length > 0 && groupName.length > 0 ? (
        <MenuList htmlFor="search-data" className={classes.menuList}>
          {filteredGroupNames.map((groupObject) => (
            <MenuItem
              key={groupObject._id}
              onClick={() => {
                onClick({
                  name: groupObject.name,
                  teacherFullName: groupObject.teacher.fullName,
                  num: groupObject.students.length,
                  groupId: groupObject._id,
                });
                setGroupName("");
              }}
            >
              {groupObject.name}
            </MenuItem>
          ))}
        </MenuList>
      ) : null}
    </>
  );
}

export default AutoCompleteInputGroupNames;
