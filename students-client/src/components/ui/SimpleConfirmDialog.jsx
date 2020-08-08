import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function SimpleConfirmDialog(props) {
  const { elements, open, handleClose, handleConfirm } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{elements.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {elements.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            {elements.confirm}
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            {elements.cancel}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
