import { types } from "../actions/types";

const initialState = {
  logs: [],
};

export default function(state=initialState, action) {
  switch(action.type) {
    case types.STORE_LOGS:
      return {
        ...state,
        logs: action.payload,
      };
    case types.UPDATE_LOG:
      return {
        ...state,
        logs: state.logs.map(log => {
          if (log.id === action.payload.id) {
            return {
              ...log,
              ...action.payload,
            }
          }
          return log;
        })
      };
    case types.ADD_LOG:
      return {
        ...state,
        logs: [
          action.payload,
          ...state.logs,
        ]
      };
    case types.DELETE_LOG:
      return {
        ...state,
        logs: state.logs.filter(log => log.id !== action.payload),
      };
    default:
      return state;
  }
}