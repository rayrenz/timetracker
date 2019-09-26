import React, { useState } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';

const useStyles  = makeStyles(theme => ({
  field: {
    margin: theme.spacing(1),
  },
}));

function AddLog(props) {
  const { open, onClose, onSubmit } = props;
  const classes = useStyles();
  const [task, setTask] = useState('');
  const [desc, setDesc] = useState('');
  const submit = () => {
    onSubmit({task, desc});
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Create new log
      </DialogTitle>
      <form onSubmit={e => {e.preventDefault(); submit(); onClose()}}>
      <DialogContent>
        <TextField
          value={task}
          label="Task"
          required
          className={classes.field}
          onChange={e => setTask(e.target.value)}
        />
        <TextField
          value={desc}
          label="Description"
          className={classes.field}
          onChange={e => setDesc(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" type="submit">Save</Button>
      </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddLog;