import * as types from '../constants/actionTypes';
import update from 'react-addons-update';

const modeOption = {
  type: 'edit',
};

export default function (state = modeOption, action) {
  switch (action.type) {
    case types.MODE_TYPE_UPDATE:
      return update(state, {
        type: { $set: action.data },
      });
    default:
      return state;
  }
}
