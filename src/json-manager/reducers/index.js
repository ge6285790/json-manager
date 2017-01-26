import { combineReducers } from 'redux';
import option from './reducer_option';
import crud from './reducer_crud';
import updateScope from './reducer_update_scope';

const rootReducer = combineReducers({
  option,
  crud,
  updateScope,
});

export default rootReducer;
