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
  updateScope: {
    flags: [],
  },
};

export default function (state = option, action) {
  switch (action.type) {
    case types.JSON_DATA_GET:
      console.log('action', action);
      return update(state, {
        defaultData: { $set: action.data }
      });
      case types.JSON_DATA_UPDATE:
        console.log('action', action);
        // return update(state, {
        //   defaultData: { $set:  action.data  }
        // });
        let flag = {};
        const last = action.flag[action.flag.length - 1];
        for (let i of action.flag) {
          if (i === last){
            flag[i] = '';
            continue;
          }
          if (!isNaN(parseInt(i, 10))) {
            flag = []
            flag[i] = {};
            continue;
          }
          console.log(i);
          flag = flag[i];
        }
        // action.flags.map((item, i) => {
        //
        // });
    default:
      return state;
  }
}
