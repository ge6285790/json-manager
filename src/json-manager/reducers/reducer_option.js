import * as types from '../constants/actionTypes';
import update from 'react-addons-update';

const option = {
  defaultData: {
    t: {
      b: {
        cc: 'aa',
      },
      v: {
        aa: 'v',
      },
      a: [
        'ccc',
        'eee',
        {
          pp: {
            bbbb: [
              1,
              'bb',
              'rr',
            ],
          },
          oooo: 'iii',
        },
      ],
    },
  },
  addMethod: 'liberty', // inherit
  // updateFlags: [],
  editScope: {
    flags: '',
    goback: [],
  },
};

export default function (state = option, action) {
  switch (action.type) {
    case types.CALL_READ_API:
      return update(state, {
        defaultData: { $set: action.data },
      });
    case types.JSON_DATA_UPDATE:
      return update(state, {
        defaultData: { $set: action.data },
      });
    case types.JSON_DATA_EDIT_TEMP_ADD:
      return update(state, {
        editScope: {
          flags: { $set: action.data },
        },
      });
    case types.JSON_DATA_EDIT_TEMP_REMOVE:
      return update(state, {
        editScope: {
          flags: { $set: '' },
        },
      });
    default:
      return state;
  }
}
