import * as types from '../constants/actionTypes';
import update from 'react-addons-update';

const initialize = {
  flags: [],
  dataTextarea: [],
  sendType: 'default',
  // sendType: 'Object',
  // sendType: 'Array',
};

export default function (state = initialize, action) {
  switch (action.type) {
    // case types.JSON_DATA_GET:
    //   return update(state, {
    //     defaultData: { $set: action.data },
    //   });
    // case types.JSON_DATA_UPDATE:
    //   return update(state, {
    //     defaultData: { $set: action.data },
    //   });
    case types.SCOPE_FLAGS_UPDATE:
      return update(state, {
        flags: { $push: [action.data] },
      });
    case types.SCOPE_FLAGS_REMOVE:
      // return update(state, {
      //   flags: { $splice: [[action.data, action.data + 1]] },
      // });
      return update(state, {
        flags: { $set: state.flags.filter((_, i) => i !== action.data) },
      });
    case types.SCOPE_SEND_TYPE_UPDATE:
      console.log(action.data);
      return update(state, {
        sendType: { $set: action.data },
      });
    default:
      return state;
  }
}
