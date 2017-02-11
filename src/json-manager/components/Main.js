/* eslint no-underscore-dangle: ["error", { "allow": ["__edited_record"] }] */
/* eslint no-continue: "error" */
/* eslint-env browser */

import React, { Component } from 'react';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import request from 'superagent';
import ObjectBlock from './objectBlock/ObjectBlock';
import ArrayBlock from './arrayBlock/ArrayBlock';
import StringBlock from './stringBlock/StringBlock';
import SettingMenuEdit from './settingMenuEdit/SettingMenuEdit';
import SettingMenuSend from './settingMenuSend/SettingMenuSend';
import ImportJsonModal from './importJsonModal/ImportJsonModal';
import * as actions from '../actions/actions';
import * as actionsCrud from '../actions/actions_crud';
import * as actionsMode from '../actions/actions_mode';
import jmgrHelper from '../helper/jmgr_helper';
import * as editHelper from '../helper/edit_helper';


console.error = (() => {
  const error = console.error;

  return function (exception, ...args) {
    if ((`${exception}`).indexOf('Warning: A component is `contentEditable`') !== 0) {
      error.apply(console, args);
    }
  };
})();

function mapStateToProps(state) {
  console.log('state', state);
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
    };

    /*
    common component use
    */
    this.renderChild = this.renderChild.bind(this);
    this.jsonDataTempAdd = this.jsonDataTempAdd.bind(this);
    this.jsonDataEditTempAdd = this.jsonDataEditTempAdd.bind(this);
    this.status = {
      addSubValueType: 'String',
      cloneSubValueType: '',
    };
    /*
    stringBlock component use
    */
    this.jsonDataUPDATE = this.jsonDataUPDATE.bind(this);

    /*
    ImportJsonModal component use
    */
    this.onDrop = this.onDrop.bind(this);
    this.modeImportModalUpdate = this.modeImportModalUpdate.bind(this);
    this.callReadApi = this.callReadApi.bind(this);

    /*
    SettingMenuEdit
    SettingMenuSend
    */
    // this.addSubValueType = 'String';
    // this.addSubValueType = this.addSubValueType.bind(this);

    /*
    SettingMenuEdit
    */
    this.renderDataEditTextarea = this.renderDataEditTextarea.bind(this);
    this.renderRefernceFlagInputValue = this.renderRefernceFlagInputValue.bind(this);
    this.editTypeUpdate = this.editTypeUpdate.bind(this);
    this.downloadJSONFile = this.downloadJSONFile.bind(this);

    /*
    SettingMenuSend
    */
    this.sendTypeUpdate = this.sendTypeUpdate.bind(this);
    this.sendApiTabSwitch = this.sendApiTabSwitch.bind(this);
    this.crudTypeUpdate = this.crudTypeUpdate.bind(this);
    this.crudUrlUpdate = this.crudUrlUpdate.bind(this);
    this.renderDataTextarea = this.renderDataTextarea.bind(this);

    this.addSubValue = this.addSubValue.bind(this);
    this.jsonDataREMOVE = this.jsonDataREMOVE.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
    const { jmgr, actions: act } = this.props;
    const that = this;
    this.callReadApi();
    jmgrHelper(jmgr, act, that);
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps');
    const { option, crud, updateScope, modeOption } = nextProps;
    this.state = {
      modeOption,
      updateScope,
      editScope: option.editScope,
      data: option.defaultData || {},
      crud,
    };
  }

  onDrop(acceptedFiles) { // rejectedFiles
    console.log('onDrop');
    const { actions: act } = this.props;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.modeImportModalUpdate('visible', 'false');
      act.jsonDataAction.callReadApi(JSON.parse(e.target.result));
    };
    if (acceptedFiles[0].type !== 'application/json') {
      alert('Only import JSON File');
      return;
    }
    reader.readAsBinaryString(acceptedFiles[0]);
  }

  modeTypeUpdate(type) {
    console.log('modeTypeUpdate');
    const { actions: act } = this.props;
    act.actionsMode.modeTypeUpdate(type);
  }

  modeImportModalUpdate(key, value) {
    console.log('modeImportModalUpdate');
    const { actions: act } = this.props;
    act.actionsMode.modeImportModalUpdate({ key, value });
  }

  callReadApi() {
    console.log('callReadApi');
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
    console.log('jsonDataUPDATE');
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
    console.log('jsonDataREMOVE');
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
    console.log('jsonDataKeyUPDATE');
    const { actions: act } = this.props;
    const newState = { ...this.state.data };

    editHelper.updateKeyObject(newState, text, refernceFlagArray, item);

    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  crudUrlUpdate(type, url) {
    console.log('crudUrlUpdate');
    const { actions: act } = this.props;
    act.actionsCrud.crudUrlUpdate({ type, url });
  }

  crudTypeUpdate(type, crudType) {
    console.log('crudTypeUpdate');
    const { actions: act } = this.props;
    act.actionsCrud.crudTypeUpdate({ type, crudType });
  }

  jsonDataTempAdd(flag) {
    console.log('jsonDataTempAdd');
    const { actions: act } = this.props;
    if (this.state.updateScope.flags.indexOf(flag) > -1) {
      return;
    }
    act.jsonDataAction.jsonDataTempAdd(flag);
  }

  jsonDataTempRemove(index) {
    console.log('jsonDataTempRemove');
    const { actions: act } = this.props;
    act.jsonDataAction.jsonDataTempRemove(index);
  }

  jsonDataEditTempAdd(flag) {
    console.log('jsonDataEditTempAdd');
    const { actions: act } = this.props;
    act.jsonDataAction.jsonDataEditTempAdd(flag);
  }

  addSubValue() {
    console.log('addSubValue');
    const { editScope, data } = this.state;
    const addSubValueType = this.status.addSubValueType;
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
        let cloneSubValueType = this.status.cloneSubValueType;
        cloneSubValueType = cloneSubValueType.split('>');
        cloneSubValueType.shift();
        newValue = { ...data };
        for (const item of cloneSubValueType) {
          newValue = newValue[item];
        }
        break;
      }
      default: {
        newValue = '';
        break;
      }
    }

    editHelper.addObject(newState, newValue, refernceFlagArray);

    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  editTypeUpdate(type) {
    console.log('editTypeUpdate');
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

    // console.log('${type}-${flagType}', `${type}-${flagType}`);

    switch (`${type}-${flagType}`) {

      case 'Object-array': {
        flagValue.forEach((_data, i) => {
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

    // const newState = Object.assign(this.state.data, {});
    const newState = { ...this.state.data };


    editHelper.updateObject(newState, newValue, refernceFlagArray);

    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  sendTypeUpdate(type) {
    console.log('sendTypeUpdate');
    const { actions: act } = this.props;
    act.jsonDataAction.sendTypeUpdate(type);
  }

  sendApiTabSwitch(tab) {
    console.log('sendApiTabSwitch');
    const { actions: act } = this.props;
    act.jsonDataAction.sendApiTabSwitch(tab);
  }

  downloadJSONFile() {
    console.log('downloadJSONFile');
    const { data } = this.state;
    const parseData = { ...data };
    this.parseData(parseData);

    const json = JSON.stringify(parseData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
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
    console.log('parseData');
    editHelper.adjustData(data);
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

  renderChild(data, blockType, refernceFlag, modeOptionType) {
    console.log('renderChild');
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
    console.log('renderRefernceFlagInputValue');
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

  renderDataTextarea() {
    console.log('renderDataTextarea');
    const { updateScope, data } = this.state;
    const type = updateScope.sendType;
    if (updateScope.flags.length === 0) {
      return '';
    }

    let flagArray = updateScope.flags.map((item) => {
      const array = item.split('>');
      let jsonData = data;
      array.shift();
      for (const i of array) {
        // console.log('send', jsonData[i], jsonData[i]['__edited_record']);
        jsonData = jsonData[i];
      }
      if (Array.isArray(jsonData) && typeof jsonData === 'object') {
        jsonData = [...jsonData];
        jsonData.splice(jsonData.indexOf('__edited_record'), 1);
      } else if (typeof jsonData === 'object') {
        jsonData = { ...jsonData };
        delete jsonData.__edited_record;
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
    console.log('renderDataEditTextarea');
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
    if (typeof jsonData === 'object' && Array.isArray(jsonData)) {
      removeEditRecord = [];
      if (jsonData.__edited_record) {
        removeEditRecord = jsonData.__edited_record.map((item) => {
          if (item.type === 'remove') {
            return item.key;
          }
        });
      } else {
        if (Array.isArray(jsonData[jsonData.length - 1])) {
          removeEditRecord = jsonData[jsonData.length - 1];
          removeEditRecord = removeEditRecord.filter((item) => {
            if (item.type === 'remove') {
              return true;
            }
            return false;
          });
          removeEditRecord = removeEditRecord.map(item => item.key);
        }
      }
      //   return array   //
      jsonData = jsonData.map((item, i) => {
        if (item[0] === '__edited_record') {
          return '';
        }
        const removed = removeEditRecord.indexOf(i) > -1;
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
        removeEditRecord = jsonData.__edited_record.map((item) => {
          if (item.type === 'remove') {
            return item.key;
          }
          if (item[0] === '__edited_record') {
            const childArray = item.map((i) => {
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
        const removed = removeEditRecord.indexOf(item.item) > -1;
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
    if (stringParent.__edited_record) {
      stringParent = stringParent.__edited_record.filter(i => i.type === 'remove');
      stringParent.map((i) => {
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
    console.log('render');
    const { actions: act } = this.props;
    const { data, updateScope, crud, modeOption, editScope } = this.state;
    const blockType = Array.isArray(data) ? 'array' : 'default';
    const { importModal } = modeOption;

    return (
      <div className="json-manager" data-theme="dark">
        <div className="mode">
          <button data-active={modeOption.type === 'edit' ? 'true' : ''} onClick={() => { this.modeTypeUpdate('edit'); }}>Edit Mode</button>
          <button data-active={modeOption.type === 'send' ? 'true' : ''} onClick={() => { this.modeTypeUpdate('send'); }}>Send Mode</button>
        </div>
        <button
          className="import-json-button"
          /* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
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
            addSubValueType: this.addSubValueType,
          }}
          status={this.status}
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
            addSubValueType: this.addSubValueType,
          }}
          crud={crud}
          render={{
            renderRefernceFlagInputValue: this.renderRefernceFlagInputValue,
            renderDataTextarea: this.renderDataTextarea,
          }}
        />


        <ImportJsonModal
          importModal={importModal}
          methods={{
            modeImportModalUpdate: this.modeImportModalUpdate,
            callReadApi: this.callReadApi,
            onDrop: this.onDrop,
          }}
          actions={{
            actionsCrud: act.actionsCrud,
          }}
          crud={crud}
        />

      </div>
    );
  }
}

Main.propTypes = {
  option: React.PropTypes.object.isRequired,
  crud: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
  updateScope: React.PropTypes.object.isRequired,
  modeOption: React.PropTypes.object.isRequired,
  jmgr: React.PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
