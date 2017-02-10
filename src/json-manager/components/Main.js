/* eslint no-underscore-dangle: ["error", { "allow": ["__edited_record"] }] */
/* eslint no-continue: "error" */
/* eslint-env browser */

import React, { Component } from 'react';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import request from 'superagent';
import Dropzone from 'react-dropzone';
import ObjectBlock from './objectBlock/ObjectBlock';
import ArrayBlock from './arrayBlock/ArrayBlock';
import StringBlock from './stringBlock/StringBlock';
import SettingMenuEdit from './settingMenuEdit/SettingMenuEdit';
import SettingMenuSend from './settingMenuSend/SettingMenuSend';
import * as actions from '../actions/actions';
import * as actionsCrud from '../actions/actions_crud';
import * as actionsMode from '../actions/actions_mode';
import jmgrHelper from '../helper/jmgr_helper';
import * as editHelper from '../helper/edit_helper';


console.error = (() => {
  const error = console.error;

  return function (exception) {
    if ((`${exception}`).indexOf('Warning: A component is `contentEditable`') !== 0) {
      error.apply(console, arguments);
    }
  };
})();

function mapStateToProps(state) {
  console.log('state', state)
  return {
    modeOption: state.modeOption,
    updateScope: state.updateScope,
    option: state.option,
    crud: state.crud,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      jsonDataAction: bindActionCreators(actions, dispatch),
      actionsCrud: bindActionCreators(actionsCrud, dispatch),
      actionsMode: bindActionCreators(actionsMode, dispatch),
    },
  };
}

class Main extends Component {
  constructor(props) {
    super(props);
    const { option, updateScope, modeOption, jmgr, actions: act } = props;
    let { crud } = props;
    // jsonDataEditTempRemove: this.jsonDataEditTempRemove,
    if (!('read' in crud)) {
      crud = jmgr.data.crud;
      act.actionsCrud.crudStateUpdate(crud);
    }
    this.state = {
      modeOption,
      updateScope,
      editScope: option.editScope,
      data: option.defaultData || {},
      crud,
      // sendApi: {
      //   type: 'update',
      // }
    };
    this.renderChild = this.renderChild.bind(this);
    this.jsonDataUPDATE = this.jsonDataUPDATE.bind(this);
    this.jsonDataTempAdd = this.jsonDataTempAdd.bind(this);
    this.jsonDataEditTempAdd = this.jsonDataEditTempAdd.bind(this);
    this.jsonDataREMOVE = this.jsonDataREMOVE.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.addSubValueType = 'String';
    this.renderDataEditTextarea = this.renderDataEditTextarea.bind(this);
    this.renderRefernceFlagInputValue = this.renderRefernceFlagInputValue.bind(this);

    this.sendTypeUpdate = this.sendTypeUpdate.bind(this);
    this.sendApiTabSwitch = this.sendApiTabSwitch.bind(this);
    this.crudTypeUpdate = this.crudTypeUpdate.bind(this);
    this.crudUrlUpdate = this.crudUrlUpdate.bind(this);
    this.renderDataTextarea = this.renderDataTextarea.bind(this);
  }

  componentDidMount() {
    const { jmgr, actions: act } = this.props;
    const that = this;
    this.callReadApi();
    jmgrHelper(jmgr, act, that);
  }

  componentWillReceiveProps(nextProps) {
    const { option, crud, updateScope, modeOption } = nextProps;
    console.log('componentWillReceiveProps', crud);
    this.state = {
      modeOption,
      updateScope,
      editScope: option.editScope,
      data: option.defaultData || {},
      crud,
    };
  }

  modeTypeUpdate(type) {
    const { actions: act } = this.props;
    act.actionsMode.modeTypeUpdate(type);
  }

  modeImportModalUpdate(key, value) {
    const { actions: act } = this.props;
    act.actionsMode.modeImportModalUpdate({ key, value });
  }


  callReadApi() {
    const { actions: act } = this.props;
    const { crud } = this.state;
    const { url, refernceFlag, type, data } = crud.read;
    if (url === '') {
      return;
    }
    if (type === 'GET') {
      request.get(url)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err || res.status !== 200) {
            // console.log(new Error(err));
            act.actionsCrud.crudResponseUPDATE((err).toString());
            return;
          }
          if (refernceFlag === '') {
            act.jsonDataAction.callReadApi(res.body);
            act.actionsCrud.crudResponseUPDATE('');
            this.modeImportModalUpdate('visible', 'false');
            return;
          }

          const arrayFlags = refernceFlag.split('>');
          let result = res.body;

          for (const item of arrayFlags) {
            result = result[item];
          }
          act.jsonDataAction.callReadApi(result);
          act.actionsCrud.crudResponseUPDATE('');
          this.modeImportModalUpdate('visible', 'false');
        });
      return;
    }
    request.post(url)
      .set('Accept', 'application/json')
      .send(data)
      .end((err, res) => {
        if (err || res.status !== 200) {
          // console.log(new Error(err));
          act.actionsCrud.crudResponseUPDATE((err).toString());
          return;
        }
        if (refernceFlag === '') {
          act.jsonDataAction.callReadApi(res.body);
          act.actionsCrud.crudResponseUPDATE('');
          this.modeImportModalUpdate('visible', 'false');
          return;
        }

        const arrayFlags = refernceFlag.split('>');
        let result = res.body;

        for (const item of arrayFlags) {
          result = result[item];
        }
        act.jsonDataAction.callReadApi(result);
        act.actionsCrud.crudResponseUPDATE('');
        this.modeImportModalUpdate('visible', 'false');
      });
  }

  jsonDataUPDATE(text, refernceFlag) {
    let parseText = text;
    if (text.indexOf('"') === 0) {
      parseText = text.replace(/"/g, '');
    } else {
      parseText = parseInt(text, 10);
    }
    const newState = { ...this.state.data };
    const { actions: act } = this.props;
    const refernceFlagArray = refernceFlag.split('>');
    refernceFlagArray.shift();
    editHelper.updateObject(newState, parseText, refernceFlagArray);
    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  jsonDataREMOVE(refernceFlagArray, item) {
    console.log('refernceFlagArray, item', refernceFlagArray, item);
    const { actions: act } = this.props;
    // const newState = Object.assign(this.state.data, {});
    const newState = { ...this.state.data };
    editHelper.adjustValueObject(newState, refernceFlagArray, item, 'remove');
    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  jsonDataRECOVER(refernceFlagArray, item) {
    console.log('jsonDataRECOVER');
    const { actions: act } = this.props;
    // const newState = Object.assign(this.state.data, {});
    const newState = { ...this.state.data };
    editHelper.adjustValueObject(newState, refernceFlagArray, item, 'recover remove');
    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  jsonDataKeyUPDATE(text, refernceFlagArray, item) {
    // const parseText = text.replace(/"/g, '');
    const { actions: act } = this.props;
    // const refernceFlagArray = refernceFlag.split('>');
    // refernceFlagArray.shift();
    // const item = refernceFlagArray.pop();
    // const newState = Object.assign(this.state.data, {});
    const newState = { ...this.state.data };


    editHelper.updateKeyObject(newState, text, refernceFlagArray, item);
    console.log('newState', newState);


    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  crudUrlUpdate(type, url) {
    const { actions: act } = this.props;
    act.actionsCrud.crudUrlUpdate({ type, url });
  }

  crudTypeUpdate(type, crudType) {
    const { actions: act } = this.props;
    act.actionsCrud.crudTypeUpdate({ type, crudType });
  }

  jsonDataTempAdd(flag) {
    const { actions: act } = this.props;
    if (this.state.updateScope.flags.indexOf(flag) > -1) {
      return;
    }
    console.log('--flag', flag);
    act.jsonDataAction.jsonDataTempAdd(flag);
  }

  jsonDataTempRemove(index) {
    const { actions: act } = this.props;
    act.jsonDataAction.jsonDataTempRemove(index);
  }

  jsonDataEditTempAdd(flag) {
    const { actions: act } = this.props;
    // if (this.state.updateScope.flags.indexOf(flag) > -1) {
    //   return;
    // }
    console.log('--flag', flag);
    act.jsonDataAction.jsonDataEditTempAdd(flag);
  }

  // jsonDataEditTempRemove(index) {
  //   const { actions: act } = this.props;
  //   act.jsonDataAction.jsonDataEditTempRemove();
  // }
  //
  // jsonDataEditor() {
  //   return this.state;
  // }

  addSubValue() {
    const { editScope, data } = this.state;
    const addSubValueType = this.addSubValueType;
    console.log('addSubValueType', addSubValueType, editScope);
    const { actions: act } = this.props;
    let refernceFlagArray = [];
    if (editScope.flags) {
      refernceFlagArray = editScope.flags.split('>');
      refernceFlagArray.shift();
    }

    // const newState = Object.assign({}, this.state.data);
    const newState = { ...this.state.data };
    let newValue;
    switch (addSubValueType) {
      case 'Object': {
        newValue = {};
        break;
      }
      case 'Array': {
        newValue = [];
        break;
      }
      case 'Clone': {
        let cloneSubValueType = this.cloneSubValueType;
        cloneSubValueType = cloneSubValueType.split('>');
        cloneSubValueType.shift();
        // newValue = Object.assign({}, data);
        newValue = { ...data };
        for (const item of cloneSubValueType) {
          newValue = newValue[item];
        }
        console.log('newValue----', newValue);
        break;
      }
      default: {
        newValue = '';
        break;
      }
    }

    editHelper.addObject(newState, newValue, refernceFlagArray);

    console.log('addObject newState', newState);
    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  // editTypeUpdate(type) {
  //   const { actions: act } = this.props;
  //   const { editScope, data } = this.state;
  //   console.log('editScope', editScope, type);
  //   const refernceFlagArray = editScope.flags.split('>');
  //   refernceFlagArray.shift();
  //   console.log('refernceFlagArray', refernceFlagArray);
  //   let flagValue = data;
  //   let newValue;
  //   if (type === 'Object') {
  //     newValue = {};
  //     for (const item of refernceFlagArray) {
  //       flagValue = flagValue[item];
  //     }
  //     if (typeof flagValue === 'object' && !Array.isArray(flagValue)) {
  //       return;
  //     }
  //     console.log('flagValue', flagValue);
  //     if (Array.isArray(flagValue)) {
  //       flagValue.forEach(function(data, i){
  //         console.log('data', data)
  //         if (data[0] === '__edited_record') {
  //           data.shift();
  //           newValue['__edited_record'] = data;
  //         } else {
  //           newValue[i] = data;
  //         }
  //
  //       });
  //     } else {
  //       newValue[0] = flagValue;
  //     }
  //     // goback
  //   }
  //   if (type === 'Array') {
  //     newValue = [];
  //     for (const item of refernceFlagArray) {
  //       flagValue = flagValue[item];
  //     }
  //     console.log('flagValue1', flagValue);
  //     if (Array.isArray(flagValue)) {
  //       return;
  //     }
  //     if (typeof flagValue === 'object'){
  //       console.log('flagValue2', flagValue);
  //       for (const item in flagValue) {
  //         if (item === '__edited_record') {
  //           console.log(flagValue['__edited_record'])
  //           flagValue['__edited_record'].unshift('__edited_record');
  //           newValue.push(flagValue['__edited_record']);
  //           continue;
  //         }
  //         newValue.push(flagValue[item]);
  //       }
  //     } else {
  //       newValue.push(flagValue);
  //     }
  //     // goback
  //   }
  //   if (type === 'String') {
  //     newValue = '';
  //     for (const item of refernceFlagArray) {
  //       flagValue = flagValue[item];
  //     }
  //     if (typeof flagValue === 'number' || typeof flagValue === 'string') {
  //       return;
  //     }
  //     console.log('flagValue', flagValue);
  //     newValue = JSON.stringify(flagValue);
  //     // if (typeof flagValue === 'object'){
  //     //   console.log('flagValue', flagValue);
  //     //   for (const item in flagValue) {
  //     //     newValue.push(flagValue[item]);
  //     //   }
  //     // } else {
  //     //   newValue.push(flagValue);
  //     // }
  //     // goback
  //   }
  //   console.log('newValue', newValue);
  //
  //   // const newState = Object.assign(this.state.data, {});
  //   const newState = { ...this.state.data };
  //
  //
  //   editHelper.updateObject(newState, newValue, refernceFlagArray);
  //
  //   act.jsonDataAction.jsonDataUPDATE(newState);
  // }

  editTypeUpdate(type) {
    const { actions: act } = this.props;
    const { editScope, data } = this.state;
    const refernceFlagArray = editScope.flags.split('>');
    refernceFlagArray.shift();
    let flagValue = data;
    let flagType;
    let newValue;

    for (const item of refernceFlagArray) {
      flagValue = flagValue[item];
    }

    if (typeof flagValue === 'object' && !Array.isArray(flagValue)) {
      flagType = 'object';
    } else if (typeof flagValue === 'object' && Array.isArray(flagValue)) {
      flagType = 'array';
    } else if (typeof flagValue === 'string') {
      flagType = 'string';
    } else {
      flagType = typeof flagValue;
    }

    if (type === 'Object') {
      newValue = {};
    } else if (type === 'Array') {
      newValue = [];
    } else if (type === 'String') {
      newValue = '';
    }

    console.log('${type}-${flagType}', `${type}-${flagType}`);

    switch (`${type}-${flagType}`) {

      case 'Object-array': {
        flagValue.forEach((_data, i) => {
          console.log('data', _data);
          if (_data[0] === '__edited_record') {
            _data.shift();
            newValue.__edited_record = _data;
          } else {
            newValue[i] = _data;
          }
        });
        break;
      }
      case 'Object-string': {
        newValue[0] = flagValue;
        break;
      }

      case 'Array-object': {
        for (const item in flagValue) {
          if (item === '__edited_record') {
            console.log(flagValue.__edited_record);
            flagValue.__edited_record.unshift('__edited_record');
            newValue.push(flagValue.__edited_record);
            continue;
          }
          newValue.push(flagValue[item]);
        }
        break;
      }
      case 'Array-string': {
        newValue.push(flagValue);
        break;
      }

      case 'String-object':
      case 'String-array': {
        newValue = JSON.stringify(flagValue);
        break;
      }

      case 'Object-object':
      case 'Array-array':
      case 'String-string':
      case 'String-boolean':
      case 'String-number': {
        return;
      }
      default: {
        return;
      }
    }

    console.log('newValue', newValue);

    // const newState = Object.assign(this.state.data, {});
    const newState = { ...this.state.data };


    editHelper.updateObject(newState, newValue, refernceFlagArray);

    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  sendTypeUpdate(type) {
    const { actions: act } = this.props;
    act.jsonDataAction.sendTypeUpdate(type);
  }

  sendApiTabSwitch(tab) {
    const { actions: act } = this.props;
    act.jsonDataAction.sendApiTabSwitch(tab);
  }

  downloadJSONFile() {
    const { data } = this.state;
    const parseData = { ...data };
    this.parseData(parseData);
    console.log(parseData);

    const json = JSON.stringify(parseData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    console.log(url);
    window.open = url;

    if (document.getElementById('json-file')) {
      document.getElementById('json-file').href = url;
      document.getElementById('json-file').click();
      return;
    }
    const jsonFile = document.createElement('a');
    jsonFile.setAttribute('id', 'json-file');
    jsonFile.download = 'JSON_FILE.json';
    jsonFile.href = url;
    jsonFile.textContent = 'Download backup.json';
    document.querySelector('.json-manager').appendChild(jsonFile);
    jsonFile.click();
  }

  parseData(data) {
    this.adjustData(data);
    if (typeof data === 'object' && Array.isArray(data)) {
      data.map((item) => {
        this.parseData(item);
        return item;
      });
    }
    if (typeof data === 'object' && !Array.isArray(data)) {
      const array = Object.keys(data);
      for (const item of array) {
        this.parseData(data[item]);
      }
    }
  }

  adjustData(data) {
    let removeList;

    if (typeof data === 'object' && Array.isArray(data) && data.length !== 0) {
      if (data[data.length - 1][0] === '__edited_record') {
        console.log('1');
        removeList = data[data.length - 1].filter((item) => {
          if (item.type === 'remove') {
            return true;
          }
          return false;
        });
        removeList.map((item) => {
          data.splice(item.key, 1);
          return item;
        });
        data.pop();
      }
    }
    if (typeof data === 'object' && !Array.isArray(data)) {
      console.log('2');
      const array = Object.keys(data);
      for (const item of array) {
        if (item === '__edited_record') {
          removeList = data.__edited_record.filter((_item) => {
            if (_item.type === 'remove') {
              return true;
            }
            return false;
          });
          removeList.map((_item) => {
            delete data[_item.key];
            return _item;
          });
          delete data.__edited_record;
        }
      }
    }
  }

  onDrop(acceptedFiles) { // rejectedFiles
    const { actions: act } = this.props;
    console.log('act', act);
    const reader = new FileReader();
    reader.onload = (e) => {
      this.modeImportModalUpdate('visible', 'false');
      act.jsonDataAction.callReadApi(JSON.parse(e.target.result));
    };
    // console.log('acceptedFiles[0].preview', acceptedFiles[0].preview);
    console.log('----acceptedFiles[0]', acceptedFiles[0]);
    if (acceptedFiles[0].type !== 'application/json') {
      alert('Only import JSON File');
      return;
    }
    reader.readAsBinaryString(acceptedFiles[0]);
  }

  renderChild(data, blockType, refernceFlag, modeOptionType) {
    const isArray = Array.isArray(data);
    let array = Object.keys(data);
    let keyTitle;
    let removeEditRecord = [];

    if (!isArray && typeof data === 'object' && data.__edited_record) {
      removeEditRecord = data.__edited_record.filter((item) => {
        if (item.type === 'remove') {
          return true;
        }
        return false;
      });
      removeEditRecord = removeEditRecord.map(item => item.key);
    } else if (isArray) {
      removeEditRecord = data;
      removeEditRecord = removeEditRecord.filter((item) => {
        if (item[0] === '__edited_record') {
          return true;
        }
        return false;
      });
      // removeEditRecord = removeEditRecord;
      if (removeEditRecord.length !== 0) {
        removeEditRecord = removeEditRecord[0].map((item) => {
          if (item.type === 'remove') {
            return JSON.stringify(item.key);
          }
          return '';
        });
      }
    }
    array = array.map((item, i) => {
      let flag = refernceFlag || '';
      const removed = removeEditRecord.indexOf(item) > -1 ? 'removed' : '';
      const key = data[item];
      let type = typeof key;
      if (type === 'object' && Array.isArray(key)) {
        type = 'array';
      }
      flag = `${flag}>${item}`;
      switch (type) {
        case 'object': {
          keyTitle = blockType === 'array' ? '' : item;
          return (
            <div className={`object-child ${removed}`} key={key + i}>
              {/* <span>{key}: </span> */}
              <ObjectBlock
                refernceFlag={flag}
                data={key}
                keyTitle={keyTitle}
                blockType={'object'}
                modeType={modeOptionType}
                methods={{
                  renderChild: this.renderChild,
                  jsonDataTempAdd: this.jsonDataTempAdd,
                  jsonDataEditTempAdd: this.jsonDataEditTempAdd,
                  // jsonDataEditTempRemove: this.jsonDataEditTempRemove,
                }}
              />
            </div>
          );
        }

        case 'array': {
          // removed = removeEditRecord.indexOf(i) > -1 ? 'removed' : '';
          // console.log('array removed', removeEditRecord, i, removed)
          console.log('array item', item, key, key[0])
          keyTitle = blockType === 'array' && item !== '__edited_record' ? '' : item;
          const editedRecord = key[0] === '__edited_record' ? '__edited_record' : '';
          return (
            <div className={`array-child ${removed}`} key={key + i}>
              <ArrayBlock
                refernceFlag={flag}
                data={key}
                keyTitle={keyTitle}
                editedRecord={editedRecord}
                blockType={'array'}
                modeType={modeOptionType}
                methods={{
                  renderChild: this.renderChild,
                  jsonDataTempAdd: this.jsonDataTempAdd,
                  // jsonDataEditor: this.jsonDataEditor,
                  jsonDataEditTempAdd: this.jsonDataEditTempAdd,
                  // jsonDataEditTempRemove: this.jsonDataEditTempRemove,
                }}
              />
            </div>
          );
        }

        default: {
          const value = typeof key === 'number' ? key : `"${key}"`;
          const valueClass = typeof key === 'number' ? 'value' : '';
          const title = isArray ? '' : `"${item}": `;
          const stringClass = title === '' ? '' : 'padding-left';
          return (
            <div className={`string-child ${removed}`} key={key + i}>
              <StringBlock
                refernceFlag={flag}
                classNameString={`string-value ${stringClass} ${valueClass}`}
                value={value}
                keyTitle={title}
                modeType={modeOptionType}
                methods={{
                  jsonDataUPDATE: this.jsonDataUPDATE,
                  jsonDataTempAdd: this.jsonDataTempAdd,
                  jsonDataEditTempAdd: this.jsonDataEditTempAdd,
                  // jsonDataEditTempRemove: this.jsonDataEditTempRemove,
                }}
              />
              ,
            </div>
          );
        }
      }
    });
    return array;
  }

  renderRefernceFlagInputValue() {
    const { updateScope } = this.state;
    if (updateScope.flags.length === 0) {
      return (
        <span className="flags" key={'Choice the key...'}>Choice the key / keys...</span>
      );
    }
    return updateScope.flags.map((item, i) => {
      return (
        <span
          className="flags"
          key={item + i}
          onClick={() => { this.jsonDataTempRemove(i, item); }}
        >
          {item}
          <span className="close">×</span>
        </span>
      );
    });
  }

  // renderRefernceEditFlagInputValue() {
  //   const { editScope } = this.state;
  //   return (
  //     <span className="flags" key={'Choice the key...editScope'}>{editScope.flags || 'Choice the key...'}</span>
  //   );
  // }

  renderDataTextarea() {
    const { updateScope, data } = this.state;
    const type = updateScope.sendType;
    if (updateScope.flags.length === 0) {
      return '';
    }

    console.log('updateScope.flags', updateScope.flags);
    let flagArray = updateScope.flags.map((item) => {
      const array = item.split('>');
      let jsonData = data;
      array.shift();
      for (const i of array) {
        // console.log('send', jsonData[i], jsonData[i]['__edited_record']);
        jsonData = jsonData[i];
      }
      console.log('jsonData', jsonData);
      if (Array.isArray(jsonData) && typeof jsonData === 'object') {
        jsonData = [...jsonData];
        console.log('jsonData----', jsonData)
        jsonData.splice(jsonData.indexOf('__edited_record'), 1);
      } else if (typeof jsonData === 'object') {
        jsonData = {...jsonData};
        console.log('jsonData----1', jsonData)
        delete jsonData['__edited_record'];
      }
      if (type === 'Object') {
        return `"${array.pop()}":${JSON.stringify(jsonData)}`;
      }
      return JSON.stringify(jsonData);
    });
    flagArray = flagArray.reduce((prev, next) => {
      return [prev, <span key={new Date() + Math.random()}><br /><br /></span>, next];
    });
    // flagArray = [flagArray];
    console.log('flagArray', flagArray)
    if (type === 'Object') {
      flagArray = Array.isArray[flagArray] ? flagArray : [flagArray];
      flagArray.unshift(<br key={new Date() + Math.random()} />);
      flagArray.unshift(<br key={new Date() + Math.random()} />);
      flagArray.unshift('{');
      flagArray.push(<br key={new Date() + Math.random()} />);
      flagArray.push(<br key={new Date() + Math.random()} />);
      flagArray.push('}');
    }
    if (type === 'Array') {
      flagArray = Array.isArray[flagArray] ? flagArray : [flagArray];
      flagArray.unshift(<br key={new Date() + Math.random()} />);
      flagArray.unshift(<br key={new Date() + Math.random()} />);
      flagArray.unshift('[');
      flagArray.push(<br key={new Date() + Math.random()} />);
      flagArray.push(<br key={new Date() + Math.random()} />);
      flagArray.push(']');
    }
    return flagArray;
  }

  renderDataEditTextarea() {
    console.log('1---');
    const { updateScope, data, editScope } = this.state;
    let jsonData = data;
    let array = [];
    let stringParent = data;
    let removeEditRecord = [];
    if (editScope.flags) {
      array = editScope.flags.split('>');
      array.shift();
      const length = array.length - 1;
      let index = -1;
      for (const i of array) {
        index += 1;
        jsonData = jsonData[i];
        if (index !== length) {
          stringParent = stringParent[i];
        }
      }
    }
    // jsonDataRECOVER
    console.log('jsonData', jsonData);
    if (typeof jsonData === 'object' && Array.isArray(jsonData)) {
      removeEditRecord = [];
      if(jsonData.__edited_record){
        removeEditRecord = jsonData.__edited_record.map(item => {
          if (item.type === 'remove') {
            return item.key;
          }

        });
      } else {

        if (Array.isArray(jsonData[jsonData.length - 1])) {
          removeEditRecord = jsonData[jsonData.length - 1];
          removeEditRecord = removeEditRecord.filter(item => {
            if (item.type === 'remove') {
              return true;
            }
          });
          removeEditRecord = removeEditRecord.map(item => {
            return item.key;
          });
        }
      }
      //   return array   //
      jsonData = jsonData.map((item, i) => {
        if (item[0] === '__edited_record') {
          return '';
        }
        const removed = removeEditRecord.indexOf(i) > -1 ? true : false;
        return (
          <span
            key={`array${i}`}
            className="textarea-edit"
          >
            {i}: [{typeof item}]
            <span
              className="remove-edit"
              onClick={() => {
                if (!removed) {
                  this.jsonDataREMOVE(array, i);
                  return;
                }
                this.jsonDataRECOVER(array, i);
              }
            }
            >{ removed ? '←' : '×' }</span>
            <br />
          </span>
        );
      });
      jsonData.unshift(<br key={new Date() + Math.random()} />);
      jsonData.unshift(<br key={new Date() + Math.random()} />);
      jsonData.unshift('[');
      jsonData.push(<br key={new Date() + Math.random()} />);
      // jsonData.push(<br key={new Date() + Math.random()} />);
      jsonData.push(']');
      return jsonData;
    } else if (typeof jsonData === 'object') {
      if (jsonData.__edited_record) {
        removeEditRecord = jsonData.__edited_record.map(item => {
          if (item.type === 'remove') {
            return item.key;
          }
          if (item[0] === '__edited_record') {
            const childArray = item.map(i => {
              if (i.type === 'remove') {
                return i.key;
              }
            });
            return [...childArray];
          }
        });
      }
      //   return object   //
      const result = [];
      for (const item in jsonData) {
        result.push({
          item,
          type: jsonData[item],
        });
      }
      jsonData = result.map((item, i) => {
        const removed = removeEditRecord.indexOf(item.item) > -1 ? true : false;
        console.log('jsonData removed', removed)
        if (item.item === '__edited_record') {
          return '';
        }
        return (
          <span key={`object${i}`} className="textarea-edit">
            <span
              className="object-key-edit"
              contentEditable="true"
              onBlur={(e) => { this.jsonDataKeyUPDATE(e.target.innerText, array, item.item); }}
            >
              {item.item}
            </span>
            : [{typeof item.type}]
            <span
              className="remove-edit"
              onClick={() => {
                if (!removed) {
                  this.jsonDataREMOVE(array, item.item);
                  return;
                }
                this.jsonDataRECOVER(array, item.item);
              }
            }
            >{ removed ? '←' : '×' }</span>
            <br />
          </span>
        );
      });
      jsonData.unshift(<br key={new Date() + Math.random()} />);
      jsonData.unshift(<br key={new Date() + Math.random()} />);
      jsonData.unshift('{');
      jsonData.push(<br key={new Date() + Math.random()} />);
      // jsonData.push(<br key={new Date() + Math.random()} />);
      jsonData.push('}');
      return jsonData;
    }
    //   return string   //
    const item = array.pop();
    let removed = false;
    console.log('array, item', array, item, stringParent);
    if (stringParent.__edited_record) {
      stringParent = stringParent.__edited_record.filter(i => {
        return i.type === 'remove' ? true : false;
      });
      console.log('stringParent', stringParent);
      stringParent.map(i => {
        if (i.key === item) {
          removed = true;
        }
      });
    }
    return (
      <span
        className="textarea-edit"
        key={'stringjsonData'}
      >
        [{typeof jsonData}]
        {/* <span
          className="remove-edit"
          onClick={() => { this.jsonDataREMOVE(array, item); }}
        >×</span> */}
        <span
          className="remove-edit"
          onClick={() => {
            if (!removed) {
              this.jsonDataREMOVE(array, item);
              return;
            }
            this.jsonDataRECOVER(array, item);
          }
        }
        >{ removed ? '←' : '×' }</span>
        <br />
      </span>
    );
  }

  render() {
    const { actions: act } = this.props;
    const { data, updateScope, crud, modeOption, editScope } = this.state;
    const blockType = Array.isArray(data) ? 'array' : 'default';
    const { importModal, type } = modeOption;

    console.log('modeOption', modeOption, crud);
    // let refernceFlagInputValue = '';
    // if (updateScope.flags.length !== 0) {
    //   refernceFlagInputValue = updateScope.flags.reduce((prev, next) => `${prev}, ${next}`);
    // }
    return (
      <div className="json-manager" data-theme="dark">
        <div className="mode">
          <button data-active={modeOption.type === 'edit' ? 'true' : ''} onClick={() => { this.modeTypeUpdate('edit'); }}>Edit Mode</button>
          <button data-active={modeOption.type === 'send' ? 'true' : ''} onClick={() => { this.modeTypeUpdate('send'); }}>Send Mode</button>
        </div>
        <button
          className="import-json-button"
          onClick={() => { importModal.visible === 'true' ? this.modeImportModalUpdate('visible', 'false') : this.modeImportModalUpdate('visible', 'true'); }}
        >
          Import JSON By API / FILE
        </button>
        <ObjectBlock
          data={data}
          methods={{ renderChild: this.renderChild, jsonDataEditTempAdd: this.jsonDataEditTempAdd }}
          blockType={blockType}
          modeType={modeOption.type}
        />

        <SettingMenuEdit
          modeOptionType={modeOption.type}
          editScopeFlags={editScope.flags}
          methods={{
            editTypeUpdate: this.editTypeUpdate,
            addSubValue: this.addSubValue,
            downloadJSONFile: this.downloadJSONFile,
          }}
          status={{
            addSubValueType: this.addSubValueType,
            cloneSubValueType: this.cloneSubValueType,
          }}
          render={{
            renderDataEditTextarea: this.renderDataEditTextarea,
          }}
        />

        <SettingMenuSend
          modeOptionType={modeOption.type}
          editScopeFlags={editScope.flags}
          updateScopeSendApiType={updateScope.sendApi.type}
          methods={{
            sendTypeUpdate: this.sendTypeUpdate,
            sendApiTabSwitch: this.sendApiTabSwitch,
            crudTypeUpdate: this.crudTypeUpdate,
            crudUrlUpdate: this.crudUrlUpdate,
          }}
          status={{
            addSubValueType: this.addSubValueType,
            cloneSubValueType: this.cloneSubValueType,

          }}
          crud={crud}
          render={{
            renderRefernceFlagInputValue: this.renderRefernceFlagInputValue,
            renderDataTextarea: this.renderDataTextarea,
          }}
        />

        <div className="import-json-modal text-center" data-active={importModal.visible}>
          <div className="modal-body text-left">
            <h3>Import JSON</h3>
            <div className="switch-tag clearfix">
              <div className="tag" data-active={importModal.type === 'api' ? 'true' : 'false'} onClick={() => { this.modeImportModalUpdate('type', 'api'); }}>API</div>
              <div className="tag" data-active={importModal.type === 'file' ? 'true' : 'false'} onClick={() => { this.modeImportModalUpdate('type', 'file'); }}>FILE</div>
            </div>
            <div className="get-json-by-api" data-active={importModal.type === 'api' ? 'true' : 'false'}>
              <div className="api-type">
                <select defaultValue={crud.read.type} onChange={(e) => { act.actionsCrud.crudTypeUpdate({ type: 'read', crudType: e.target.value }); }}>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
                <input defaultValue={crud.read.url} onBlur={(e) => { act.actionsCrud.crudUrlUpdate({ type: 'read', url: e.target.value }); }} />
              </div>
              <div className="post-data">
                <p>POST data：</p>
                <textarea onChange={(e) => { act.actionsCrud.crudDataUpdate({ type: 'read', value: e.target.value }); }} defaultValue="{}"></textarea>
              </div>
              <p className="showError" data-active={crud.response === '' ? 'false' : 'true'}>*{crud.response}</p>
              <div className="api-send">
                <div onClick={() => { this.callReadApi(); }}>Send</div>
              </div>
            </div>
            <div className="get-json-by-drop" data-active={importModal.type === 'file' ? 'true' : 'false'}>
              <div className="file-data">
                <div className="paddingBottom" />
                <Dropzone className="dropzone" onDrop={this.onDrop} style={{width: '100%', height: '100%', position: 'absolute', top: '0px', left: '0px'}}>
                  <div className="text-center">dropping JSON File here.</div>
                </Dropzone>
              </div>
            </div>
            <div className="close" onClick={() => { this.modeImportModalUpdate('visible', 'false'); }}>×</div>
          </div>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  option: React.PropTypes.object.isRequired,
  crud: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
  updateScope: React.PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
