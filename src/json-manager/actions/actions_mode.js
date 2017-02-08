import * as types from '../constants/constants_mode';

export function modeTypeUpdate(data) {
  return {
    type: types.MODE_TYPE_UPDATE,
    data,
  };
}

export function modeImportModalUpdate(data) {
  return {
    type: types.MODE_IMPORT_MODAL_UPDATE,
    data,
  };
}
