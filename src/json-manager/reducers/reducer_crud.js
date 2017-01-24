const crud = {
  // if don't, just let it empty, default is false
  create: 'aa',
  read: {
    url: 'https://store.readmoo.com/api/reading17/get',
    type: 'GET',
    data: {},
    refernceFlag: '',
  },
  update: {
    url: 'cc',
    type: 'POST',
    refernceFlag: '>month1>arrayIndex>day',
    id: 'day', // default '';
  },
  delete: {
    url: 'dd',
    refernceFlag: 'title>id',
  },
};

export default function (state = crud, action) {
  switch (action.type) {
    default:
      return state;
  }
}
