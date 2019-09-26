import React, { useState, useEffect } from 'react';
import { makeStyles, TextField, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import {KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import moment from 'moment';
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles(theme => ({
  field: {
    display: 'inline-block',
    marginBottom: '1rem',
    marginRight: '1rem',
  },
  modal: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: '75vw',
    minWidth: '500px',
    margin: '0 auto',
  },
}));

function UpdateLogModal(props) {
  const classes = useStyles();
  const { open, onClose, data, onSubmit } = props;
  const [logData, setLogData] = useState({});
  useEffect(() => {
    setLogData(data);
  }, []);
  const changeHandler = e => {
    setLogData({
      ...logData,
      [e.target.name]: e.target.value,
    })
  };
  const dateChangeHandler = (dateObj, name) => {
    setLogData({
      ...logData,
      [name]: moment(dateObj)
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
        <form onSubmit={e => {e.preventDefault(); onSubmit(logData); onClose();}}>
          <DialogTitle>
            Edit log
          </DialogTitle>
          <DialogContent>
            <TextField value={logData.task} label="Task" name="task" className={classes.field} onChange={changeHandler} max="10" required/>
            <TextField value={logData.description} label="Description" name="description" className={classes.field} onChange={changeHandler}/>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              label="Start date"
              value={logData.start}
              onChange={val => dateChangeHandler(val, 'start')}
            />
            <KeyboardTimePicker
              label="Start time"
              value={logData.start}
              onChange={val => dateChangeHandler(val, 'start')}
            />
            <KeyboardDatePicker
              label="End date"
              value={logData.end}
              onChange={val => dateChangeHandler(val, 'end')}
            />
            <KeyboardTimePicker
              label="End time"
              value={logData.end}
              onChange={val => dateChangeHandler(val, 'end')}
            />
            </MuiPickersUtilsProvider>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" type="submit">Save</Button>
          </DialogActions>
        </form>
    </Dialog>
  );
}

export default UpdateLogModal;