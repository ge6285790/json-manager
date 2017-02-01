import * as types from '../constants/actionTypes';
import update from 'react-addons-update';

const crud = {
  // if don't, just let it empty, default is false
  create: {
    url: 'https://store.readmoo.com/api/reading17/get',
    // url: 'https://www.youtube.com/feed_ajax?action_get_unseen_notification_count=1',
    type: 'POST',
  },
  read: {
    url: 'https://store.readmoo.com/api/reading17/get',
    // url: 'https://www.youtube.com/feed_ajax?action_get_unseen_notification_count=1',
    type: 'GET',
    data: {},
    refernceFlag: '',
  },
  update: {
    url: 'cc',
    type: 'GET',
    // refernceFlag: '>month1>arrayIndex>day',
    id: 'day', // default '';
  },
  delete: {
    url: 'dd',
    refernceFlag: 'title>id',
  },
};

export default function (state = crud, action) {
  switch (action.type) {
    case types.CRUD_URL_UPDATE:
      return update(state, {
        [action.data.type]: {
          url: { $set: action.data.url },
        },
      });
    case types.CRUD_TYPE_UPDATE:
      return update(state, {
        [action.data.type]: {
          type: { $set: action.data.crudType },
        },
      });
    default:
      return state;
  }
}
