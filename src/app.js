import Jmgr from './json-manager';
// var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;


// console.log('aaa2');
//
// const option = {
//   defaultData: {
//     t: {
//       b: {
//         cc: 'aa',
//       },
//       v: {
//         aa: 'v',
//       },
//       a: [
//         'ccc',
//         'eee',
//         {
//           pp: {
//             bbbb: [
//               1,
//               'bb',
//               'rr',
//             ],
//           },
//           oooo: 'iii',
//         },
//       ],
//     },
//   },
//   addMethod: 'liberty', // inherit
// };
//
// const crud = {
//   // if don't, just let it empty, default is false
//   create: 'aa',
//   read: 'bb',
//   update: {
//     url: 'cc',
//     refernceFlag: 'title>id',
//   },
//   delete: {
//     url: 'dd',
//     refernceFlag: 'title>id',
//   },
// }

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
  crud: {
    create: {
      url: 'https://store.readmoo.com/api/reading17/get',
      type: 'POST',
      data: {},
    },
    read: {
      url: 'https://store.readmoo.com/api/reading17/get',
      type: 'GET',
      data: {},
      refernceFlag: '',
    },
    update: {
      url: 'cc',
      type: 'GET',
      data: {},
    },
    delete: {
      url: 'dd',
      type: 'GET',
      data: {},
    },
  },
  elementId: 'root'
};

// const elementId = 'root';

const json1 = new Jmgr(option);

json1.render();

window.json1 = json1;
