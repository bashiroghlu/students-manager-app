import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

export default function Select(props) {
  const {
    options,
    id,
    label,
    helperText,
    value,
    variant,
    fullWidth,
    handleChange,
    margin,
  } = props;

  return (
    <TextField
      id={id ? id : null}
      select
      label={label ? label : null}
      helperText={helperText ? helperText : null}
      value={value ? value : null}
      variant={variant ? variant : "standard"}
      margin={margin ? margin : "none"}
      fullWidth={fullWidth ? fullWidth : null}
      onChange={handleChange ? handleChange : null}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
