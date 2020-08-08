import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

export default function UserDetails(props) {
  const { userDetails, setUserDetails, openUpdateDetailsDialog } = props;
  return (
    <Grid item container direction="row" spacing={2} alignItems="flex-end">
      <Grid item md={4} xs={12} sm={6}>
        <TextField
          id="name-text"
          label="Provide Name"
          value={userDetails.name}
          onChange={(event) =>
            setUserDetails({ ...userDetails, name: event.target.value })
          }
          fullWidth
        />
      </Grid>
      <Grid item md={4} xs={12} sm={6}>
        <TextField
          id="surname-text"
          label="Surname:"
          value={userDetails.surname}
          onChange={(event) =>
            setUserDetails({ ...userDetails, surname: event.target.value })
          }
          fullWidth
        />
      </Grid>
      <Grid item md={4} xs={12} sm={6}>
        <TextField
          id="birth-date"
          label="Birth Date:"
          value={userDetails.birthDate}
          fullWidth
          type="date"
          onChange={(event) =>
            setUserDetails({ ...userDetails, birthDate: event.target.value })
          }
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item md={4} xs={12} sm={6}>
        <TextField
          id="standard-select-currency"
          select
          label="Sex:"
          value={userDetails.gender}
          fullWidth
          onChange={(event) =>
            setUserDetails({ ...userDetails, gender: event.target.value })
          }

        >
          {[
            { value: "male", label: "Kişi" },
            { value: "female", label: "Qadın" },
            { value: "unknown", label: "Bilinmir" },
            { value: "other", label: "Digər" },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item md={3} xs={12}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => {
            openUpdateDetailsDialog();
          }}
        >
          Update Your Data
        </Button>
      </Grid>
    </Grid>
  );
}
