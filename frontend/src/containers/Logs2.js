import React, {Fragment, useEffect, useState, useCallback, useMemo} from 'react';
import {connect} from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import makeStyles from "@material-ui/core/styles/makeStyles";
import _ from 'lodash';
import moment from 'moment';
import {logActions} from "../actions/logs";
import UpdateLogModal from './UpdateLogModal';
import AddLogModal from "./AddLogModal";
import {dateTimeFormat} from "../constants/formats";
import {useQuery} from "@apollo/react-hooks";
import logQueries from "../queries/logs";

const useStyles = makeStyles(theme => ({
  editButton: {
    marginRight: theme.spacing(1),
  },
  continueButton: {
    marginRight: theme.spacing(1),
  },
  taskColumn: {
    width: '10%',
  },
  actionsColumn: {
    width: '210px',
  },
  statusColumn: {
    width: '50px',
  },
  archived: {
    opacity: 0.4,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '5rem',
    fontSize: '2rem',
  },
  group: {
    backgroundColor: '#aeaeae',
    borderBottom: '2px solid #000000',
    color: 'white',
    fontWeight: 600,
  },
  loading: {
    opacity: 0.4,
    pointerEvents: 'none',
  }
}));

function ISO8601_week_no() {
   const tdt = new Date();
   const dayn = (tdt.getDay() + 6) % 7;
   tdt.setDate(tdt.getDate() - dayn + 3);
   const firstThursday = tdt.valueOf();
   tdt.setMonth(0, 1);
   if (tdt.getDay() !== 4) 
     {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
      }
   return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

function Logs(props) {
   const classes = useStyles();
  const { getLogs, updateLog, continueLog, deleteLog, addLog, removeLog } = props;
  const [current, setCurrent] = useState(null);
  const [logsToDisplay, setLogsToDisplay] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [logToEdit, setLogToEdit] = useState({});
  const [week, setWeek] = useState(ISO8601_week_no());
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(0);
  const renderedGroups = [];
  let totalMinutes = 0;

  const onOpenModal = (log) => () => {
    console.log('open', log);
    setLogToEdit(log);
  };
  const getLogsDebounced = useCallback(_.debounce(async (queryString) => {
    setLoading(1);
    console.log('requesting');
    await getLogs(queryString, (e) => {
      const prog = Math.floor(e.loaded / e.total) * 100;
      setLoading(prog);
      if (prog && prog % 100 === 0) {
        setTimeout(() => setLoading(0), 500);
      }
    });
    console.log('done request');
  }, 1000), []);
  const stopLog = log => {
    updateLog({
      ...log,
      end: moment(),
    })
  };
  const updateStatus = async function (log) {
    const res = await updateLog({
      ...log,
      status: log.status === 'o' ? 'a' : 'o',
    });
    if (res === 'success' && filters.status === 'o' && log.status === 'o') {
      removeLog(log.id);
    }
  };
  const onToggleStatus = e => setStatus(e.target.checked ? 'o' : '');
  const onWeekChange = e => {
    try {
      const val = parseInt(e.target.value);
      if (val && val < 53) {
        setWeek(val);
      } else {
        setWeek(ISO8601_week_no)
      }
    } catch(e) {
      console.log('tried to enter invalid integer', e);
    }
  };

  const {loading: isLoading, error, data} = useQuery(logQueries.ALL_LOGS, {
    variables: { week, status },
    onCompleted: (data) => {
      if (data.allLogs) {
        for(let log of data.allLogs) {
          log.mStart = moment(log.start).startOf('minute');
          if (log.end) {
            log.mEnd = moment(log.end).startOf('minute');
          }
        }
        setLogs(data.allLogs);
      }
    }
  });

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          {!!loading &&
            <LinearProgress
              value={loading}
              variant="buffer"
              valueBuffer={100}
              color="secondary"
            />}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h3" onClick={e => location.reload()}>
            Logs
          </Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  value={status === 'o'}
                  onChange={onToggleStatus}
                />
              }
              labelPlacement="start"
              label="Hide archived"
            />
            <TextField
              label="Week"
              value={week}
              id="outlined"
              className={classes.textField}
              onChange={onWeekChange}
            />
            <Button onClick={() => setAddOpen(true)} variant="outlined" disabled={current} size="small">
              Add <AddCircleIcon/>
            </Button>
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Table size="small" className={loading && classes.loading}>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell className={classes.actionsColumn}/>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map(log => {
                return (
                  <Fragment key={log.id}>
                      <TableRow key={log.id} className={log.status === 'a' ?  classes.archived : ''}>
                        <TableCell className={classes.taskColumn}>
                          {log.task}
                        </TableCell>
                        <TableCell>
                          {log.description}
                        </TableCell>
                        <TableCell>
                          {log.mStart.format(dateTimeFormat)}
                        </TableCell>
                        <TableCell>
                          {log.mEnd ? log.mEnd.format(dateTimeFormat) : ''}
                        </TableCell>
                        <TableCell>
                        </TableCell>
                        <TableCell className={classes.actionsColumn}>
                          <Button className={classes.editButton} variant="contained" size="small"
                                  onClick={onOpenModal(log)}>
                            <EditIcon/>
                          </Button>
                          {log.end ?
                            <Button className={classes.continueButton} color="primary" size="small"
                                    disabled={current} variant="contained" onClick={() => continueLog(log)}>
                              <PlayArrowIcon/>
                            </Button> :
                            <Button className={classes.continueButton} color="primary" size="small"
                                    variant="contained" onClick={() => stopLog(log)}>
                              <StopRoundedIcon/>
                            </Button>
                          }
                          <Button variant="contained" color="secondary" size="small"
                                  onClick={() => deleteLog(log)}>
                            <DeleteIcon/>
                          </Button>
                        </TableCell>
                        <TableCell className={classes.statusColumn}>
                          <Checkbox checked={log.status === 'a'} onChange={() => updateStatus(log)}/>
                        </TableCell>
                      </TableRow>
                    </Fragment>)
              })}
              <TableRow>
                <TableCell colSpan={7} style={{textAlign: 'right'}}>
                  Duration: {(() => {
                    let hours = parseInt(totalMinutes / 60);
                    let minutes = totalMinutes % 60;
                    return (
                      <span>
                        {hours}h {minutes}m
                      </span>
                    )
                })()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <UpdateLogModal open={!_.isEmpty(logToEdit)} data={logToEdit} onClose={() => setLogToEdit({})} onSubmit={updateLog}/>}
      <AddLogModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={addLog} />
    </Fragment>
  )
}

const mapStateToProps = state => ({
  logs: state.logs.logs,
});

const mapDispatchToProps = ({
  getLogs: logActions.getLogs,
  updateLog: logActions.updateLog,
  continueLog: logActions.continueLog,
  deleteLog: logActions.deleteLog,
  addLog: logActions.addLog,
  removeLog: logActions.removeLog,
});

export default connect(mapStateToProps, mapDispatchToProps)(Logs);