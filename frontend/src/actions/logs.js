import axios from 'axios';
import moment from 'moment';
import { types } from "./types";

export const logActions = {
  getLogs: (filter = '') => dispatch => {
    axios
      .get(`/api/logs/${filter}`)
      .then(res => {
        res.data.map(log => {
          log.start = moment(log.start).startOf('minute');
          if (log.end) {
            log.end = moment(log.end).startOf('minute');
          }
        });
        dispatch({
          type: types.STORE_LOGS,
          payload: res.data,
        })
      })
      .catch(error => {
        console.log(error);
      })
  },
  updateLog: data => dispatch => {
    const {id, description, start, end, task, status} = data;
    axios
      .put(`/api/logs/${id}/`, {
        task,
        description,
        start: start.startOf('minute').toISOString(),
        end: end ? end.startOf('minute').toISOString() : null,
        status,
      })
      .then(res => {
        console.log(res);
        dispatch({
          type: types.UPDATE_LOG,
          payload: data,
        })
      })
      .catch(error => {
        console.log(error);
      });
  },
  continueLog: data => dispatch => {
    const {task, description} = data;
    axios
      .post(`/api/logs/`, {
        task,
        description,
      })
      .then(res => {
        dispatch({
          type: types.ADD_LOG,
          payload: {
            ...res.data,
            start: moment(res.data.start).startOf('minute'),
            end: null,
          },
        })
      })
      .catch(error => {
        console.log(error);
      });
  },
  deleteLog: data => dispatch => {
    const { id } = data;
    axios
      .delete(`/api/logs/${id}/`)
      .then(res => {
        dispatch({
          type: types.DELETE_LOG,
          payload: id,
        });
      })
      .catch(error => {
        console.log(error);
      });
  },
  addLog: data => dispatch => {
    axios
      .post('/api/logs/', data)
      .then(res => {
        dispatch({
          type: types.ADD_LOG,
          payload: {
            ...res.data,
            start: moment(res.data.start),
          }
        });
      })
      .catch(err => console.log(err));
  },
};