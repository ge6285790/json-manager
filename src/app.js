import Jmgr from './json-manager/index';

const option = {
  defaultData: {
    desc: 'this is demo data, you can use right menu to edit this',
    status: 'ok',
    last_day: 54,
    today: 37,
    total_time: 0,
    goal_time: 2017,
    daily_need_time: 38,
    daily: [],
    month1: [
      {
        day: '2017-01-01',
        total: 0,
      },
      {
        day: '2017-01-02',
        total: 0,
      },
      {
        day: '2017-01-03',
        total: 0,
      },
      {
        day: '2017-01-04',
        total: 0,
      },
      {
        day: '2017-01-05',
        total: 0,
      },
      {
        day: '2017-01-06',
        total: 0,
      },
      {
        day: '2017-01-07',
        total: 0,
      },
      {
        day: '2017-01-08',
        total: 0,
      },
      {
        day: '2017-01-09',
        total: 0,
      },
      {
        day: '2017-01-10',
        total: 0,
      },
      {
        day: '2017-01-11',
        total: 0,
      },
      {
        day: '2017-01-12',
        total: 0,
      },
      {
        day: '2017-01-13',
        total: 0,
      },
      {
        day: '2017-01-14',
        total: 0,
      },
      {
        day: '2017-01-15',
        total: 0,
      },
      {
        day: '2017-01-16',
        total: 0,
      },
      {
        day: '2017-01-17',
        total: 0,
      },
      {
        day: '2017-01-18',
        total: 0,
      },
      {
        day: '2017-01-19',
        total: 0,
      },
      {
        day: '2017-01-20',
        total: 0,
      },
      {
        day: '2017-01-21',
        total: 0,
      },
      {
        day: '2017-01-22',
        total: 0,
      },
      {
        day: '2017-01-23',
        total: 0,
      },
      {
        day: '2017-01-24',
        total: 0,
      },
      {
        day: '2017-01-25',
        total: 0,
      },
      {
        day: '2017-01-26',
        total: 0,
      },
      {
        day: '2017-01-27',
        total: 0,
      },
      {
        day: '2017-01-28',
        total: 0,
      },
      {
        day: '2017-01-29',
        total: 0,
      },
      {
        day: '2017-01-30',
        total: 0,
      },
      {
        day: '2017-01-31',
        total: 0,
      },
    ],
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
  elementId: 'root',
};

// const elementId = 'root';

const json1 = new Jmgr(option);

json1.render();
