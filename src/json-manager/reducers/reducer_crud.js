import update from 'react-addons-update';
import * as types from '../constants/constants_crud';

export default function (state = {}, action) {
  switch (action.type) {
    case types.CRUD_STATE_UPDATE:
      return action.data;
    case types.CRUD_URL_UPDATE:
      return update(state, {
        [action.data.type]: {
          url: { $set: action.data.url },
        },
      });
    case types.CRUD_DATA_UPDATE:
      return update(state, {
        [action.data.type]: {
          data: { $set: action.data.value },
        },
      });
    case types.CRUD_TYPE_UPDATE:
      return update(state, {
        [action.data.type]: {
          type: { $set: action.data.crudType },
        },
      });
    case types.CRUD_RESPONSE_UPDATE:
      return update(state, {
        response: { $set: action.data }
      });
    default:
      return state;
  }
}
