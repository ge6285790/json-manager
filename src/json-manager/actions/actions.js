

// export function getJsonData(getUrl, flag) {
//   return new Promise((resolve, reject) => {
//     fetch('https://store.readmoo.com/api/reading17/get')
//       .then(response => resolve(response));
//   })
// }
import * as types from '../constants/actionTypes';

// export function modeTypeUpdate(data) {
//   return {
//     type: types.MODE_TYPE_UPDATE,
//     data,
//   };
// }

export function callReadApi(data) {
  return {
    type: types.CALL_READ_API,
    data,
  };
}

export function jsonDataUPDATE(data) {
  return {
    type: types.JSON_DATA_UPDATE,
    data,
  };
}

export function jsonDataTempAdd(data) {
  return {
    type: types.JSON_DATA_TEMP_ADD,
    data,
  };
}

export function jsonDataTempRemove(data) {
  return {
    type: types.JSON_DATA_TEMP_REMOVE,
    data,
  };
}

export function jsonDataEditTempAdd(data) {
  return {
    type: types.JSON_DATA_EDIT_TEMP_ADD,
    data,
  };
}

export function jsonDataEditTempRemove(data) {
  return {
    type: types.JSON_DATA_EDIT_TEMP_REMOVE,
    data,
  };
}

export function sendApiTabSwitch(data) {
  return {
    type: types.SCOPE_SEND_API_TYPE,
    data,
  };
}

export function sendTypeUpdate(data) {
  return {
    type: types.SCOPE_SEND_TYPE_UPDATE,
    data,
  };
}
