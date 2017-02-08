import * as types from '../constants/constants_crud';

export function crudStateUpdate(data) {
  return {
    type: types.CRUD_STATE_UPDATE,
    data,
  };
}

export function crudUrlUpdate(data) {
  return {
    type: types.CRUD_URL_UPDATE,
    data,
  };
}

export function crudDataUpdate(data) {
  return {
    type: types.CRUD_DATA_UPDATE,
    data,
  };
}

export function crudTypeUpdate(data) {
  return {
    type: types.CRUD_TYPE_UPDATE,
    data,
  };
}

export function crudResponseUPDATE(data) {
  return {
    type: types.CRUD_RESPONSE_UPDATE,
    data,
  };
}
