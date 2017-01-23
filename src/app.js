import Jmgr from './json-manager';
// var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;


console.log('aaa2');

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

const crud = {
  // if don't, just let it empty, default is false
  create: 'aa',
  read: 'bb',
  update: {
    url: 'cc',
    refernceFlag: 'title>id',
  },
  delete: {
    url: 'dd',
    refernceFlag: 'title>id',
  },
}

const elementId = 'root';

const json1 = new Jmgr(option, crud, elementId);

json1.render();
