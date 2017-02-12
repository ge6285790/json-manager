import { combineReducers } from 'redux';
import option from './reducer_option';
import crud from './reducer_crud';
import updateScope from './reducer_update_scope';
import modeOption from './reducer_mode';

const rootReducer = combineReducers({
  modeOption,
  option,
  crud,
  updateScope,
});

export default rootReducer;
