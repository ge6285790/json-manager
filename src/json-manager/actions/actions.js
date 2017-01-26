

// export function getJsonData(getUrl, flag) {
//   return new Promise((resolve, reject) => {
//     fetch('https://store.readmoo.com/api/reading17/get')
//       .then(response => resolve(response));
//   })
// }
import * as types from '../constants/actionTypes';

export function jsonDataGET(data) {
  return {
    type: types.JSON_DATA_GET,
    data,
  };
}

export function jsonDataUPDATE(data) {
  return {
    type: types.JSON_DATA_UPDATE,
    data,
  };
}

export function dataPrepare(data) {
  return {
    type: types.SCOPE_FLAGS_UPDATE,
    data,
  };
}

export function dataFlagRemove(data) {
  return {
    type: types.SCOPE_FLAGS_REMOVE,
    data,
  };
}

export function sendTypeUpdate(data) {
  return {
    type: types.SCOPE_SEND_TYPE_UPDATE,
    data,
  };
}
