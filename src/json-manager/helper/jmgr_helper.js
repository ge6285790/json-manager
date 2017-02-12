/* eslint no-undef: "error" */
/* eslint-env browser */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint max-len: ["error", 130] */

export default function jmgrHelper(jmgr, act, that) {
  jmgr.style = () => {
    console.log('style');
  };

  jmgr.mode = {
    /*
    importMode => show import modal or not
    visible is boolean string,
    'true' => show import modal,
    'false' => hide import modal
    */
    importMode: (visible) => {
      const boolean = visible || (document.querySelector('.import-json-modal').dataset.active === 'false' ? 'true' : 'false');
      that.modeImportModalUpdate('visible', boolean);
    },


    /*
    editMode => switch to edit mode
    */
    editMode: () => {
      that.modeTypeUpdate('edit');
    },


    /*
    editMode => switch to send mode
    */
    sendMode: () => {
      that.modeTypeUpdate('send');
    },
  };

  jmgr.crud = {
    /*
    updateUrl => update create/read/upload/delete ajax url
    option => an object, should have 'type: create/read/upload/delete' and 'url: href' key value pairs
    ex. option: {
      type: 'read',
      url: 'http://google.com'
    }
    */
    updateUrl: (option) => {
      act.actionsCrud.crudUrlUpdate(option);
    },


    /*
    updateData => update create/read/upload/delete ajax data
    option => an object, should have 'type: create/read/upload/delete' and 'value: value' key value pairs
    ex. option: {
      type: 'read',
      value: {
        pid: '111',
      }
    }
    */
    updateData: (option) => {
      act.actionsCrud.crudDataUpdate(option);
    },


    /*
    updateType => update create/read/upload/delete ajax type
    option => an object, should have 'type: create/read/upload/delete' and 'crudType: GET/POST/DELETE' key value pairs
    ex. option: {
      type: 'read',
      crudType: 'GET'
    }
    */
    updateType: (option) => {
      act.actionsCrud.crudTypeUpdate(option);
    },

    /*
    resetAllOption => reset create, read, upload, delete All ajax set
    option => an object, should have 'create, read, upload, delete' key value pairs
    ex. option: {
      type: 'read',
      crudType: 'GET'
    }
    */
    resetAllOption: (option) => {
      act.actionsCrud.crudStateUpdate(option);
    },

    create: () => {
      that.callUpdateApi('create');
    },

    read: () => {
      that.callReadApi();
    },

    update: () => {
      that.callUpdateApi('update');
    },

    delete: () => {
      that.callUpdateApi('delete');
    },
  };

  jmgr.modeChange = (mode) => {
    that.modeTypeUpdate(mode);
  };

  jmgr.importJSON = () => {
    console.log('import');
  };

  jmgr.exportJSON = () => {
    that.downloadJSONFile();
  };

  jmgr.send = {
    flagSelect: (string) => {
      console.log('flagSelect');
      that.jsonDataTempAdd(string);
    },
  };

  jmgr.edit = {
    flagSelect: (string) => {
      that.jsonDataEditTempAdd(string);
    },

    typeChange: (type) => { // upper
      that.editTypeUpdate(type);
    },

    create: (type) => { // upper
      that.status.addSubValueType = type;
      that.addSubValue();
    },

    remove: (array, anchor) => {
      that.jsonDataREMOVE(array, anchor);
      // json1.edit.remove(['month1'], 1)
      // json1.edit.remove(['month1',0], 'day')
    },

    recover: (array, key) => {
      that.jsonDataRECOVER(array, key);
    },
  };
}
