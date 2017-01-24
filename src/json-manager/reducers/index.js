import { combineReducers } from 'redux';
import option from './reducer_option';
import crud from './reducer_crud';

const rootReducer = combineReducers({
  option,
  crud,
});

export default rootReducer;
