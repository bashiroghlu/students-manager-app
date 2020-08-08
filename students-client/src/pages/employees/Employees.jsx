import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  TableContainer,
  Grid,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import SimpleTableForEmployees from "./SimpleTableForEmployees";
import { AuthContext } from "../../context/auth-context";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const tableHeaderOptions = [
    { name: "#" },
    { name: "Employee name" },
    { name: "Employee Status" },
  ];

  useEffect(() => {
    const source = axios.CancelToken.source();

    async function getData() {
      setLoading(true);
      const headersObject = {
        "Content-Type": "application/json",
        authorization: "Bearer " + auth.token,
      };

      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/api/v1/employees`,
          headers: headersObject,
          cancelToken: source.token,
        });

        if (response.data.status === "success") {
          setLoading(false);
          setEmployees(response.data.employees);
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
  }, [auth.token]);

  return (
    <Grid container direction="column">
      {loading ? (
        <Grid
          style={{ minHeight: "30vh" }}
          container
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        <Grid item component={Paper} style={{ maxWidth: "100%" }}>
          <TableContainer>
            <SimpleTableForEmployees
              tableHeaderOptions={tableHeaderOptions}
              rows={employees}
            />
          </TableContainer>
        </Grid>
      )}
    </Grid>
  );
}
