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
};

export default function (state = option, action) {
  switch (action.type) {
    case types.JSON_DATA_GET:
      console.log('action', action);
      return update(state, {
        defaultData: { $set:  action.data  }
      });
    default:
      return state;
  }
}
