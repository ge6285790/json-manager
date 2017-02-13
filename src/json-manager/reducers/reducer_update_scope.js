import update from 'react-addons-update';
import * as types from '../constants/actionTypes';

const initialize = {
  flags: [],
  dataTextarea: '',
  sendApi: {
    type: 'update',
  },
  sendType: 'default',
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
    case types.JSON_DATA_TEMP_ADD:
      return update(state, {
        flags: { $push: [action.data] },
      });
    case types.JSON_DATA_TEMP_REMOVE:
      // return update(state, {
      //   flags: { $splice: [[action.data, action.data + 1]] },
      // });
      return update(state, {
        flags: { $set: state.flags.filter((_, i) => i !== action.data) },
      });
    case types.SCOPE_SEND_TYPE_UPDATE:
      return update(state, {
        sendType: { $set: action.data },
      });
    case types.SCOPE_SEND_API_TYPE:
      return update(state, {
        sendApi: {
          type: { $set: action.data },
        },
      });
    default:
      return state;
  }
}
