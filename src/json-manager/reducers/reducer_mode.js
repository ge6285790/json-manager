import * as types from '../constants/constants_mode';
import update from 'react-addons-update';

const modeOption = {
  type: 'edit',
  importModal: {
    visible: 'false',
    type: 'api',
  },
};

export default function (state = modeOption, action) {
  switch (action.type) {
    case types.MODE_TYPE_UPDATE:
      return update(state, {
        type: { $set: action.data },
      });
    case types.MODE_IMPORT_MODAL_UPDATE:
      return update(state, {
        importModal: {
          [action.data.key]: {
            $set: action.data.value,
          },
        },
      });
    default:
      return state;
  }
}
