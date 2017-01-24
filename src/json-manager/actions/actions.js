

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

// export function jsonDataUPDATE(data) {
//
// }
