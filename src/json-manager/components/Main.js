import React, { Component } from 'react';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import request from 'superagent';
import ObjectBlock from './objectBlock/ObjectBlock';
import ArrayBlock from './arrayBlock/ArrayBlock';
import StringBlock from './stringBlock/StringBlock';
import * as actions from '../actions/actions';

console.error = (() => {
  const error = console.error;

  return function (exception) {
    if ((`${exception}`).indexOf('Warning: A component is `contentEditable`') !== 0) {
      error.apply(console, arguments);
    }
  };
})();

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x100)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function updateObject(object, newValue, flag) {
  while (flag.length > 1) {
    let index = flag.shift();
    index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
    object = object[index];
  }
  let index = flag.shift();
  index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
  const oldValue = Object.assign(object[index], {});
  // const oldValue = { ...object[index] };
  if (object[index] === newValue) {
    return;
  }
  object[index] = newValue;
  console.log('object type', object)


  //--------
  if (Array.isArray(object)) {
    let newEditedRecord = object.filter(item => {
      if (item[0] === '__edited_record') {
        return true;
      }
    });
    if (newEditedRecord.length === 0) {
      newEditedRecord = ['__edited_record']
    } else {
      newEditedRecord = newEditedRecord[0];
      const indexNumber = object.indexOf(newEditedRecord);
      object.splice(indexNumber, 1);
    }
    // newEditedRecord = newEditedRecord.length === 0 ? ['__edited_record'] : newEditedRecord[0];

    newEditedRecord.push({
      key: index,
      type: `[Object Value Update]: '${JSON.stringify(oldValue)}' convert to '${JSON.stringify(newValue)}'`,
    });

    object.push(newEditedRecord);
    return;
  }

  //-----------


  let newEditedRecord = object['__edited_record'] || [];
  newEditedRecord = [...newEditedRecord];
  newEditedRecord.push({
    key: index,
    type: `[Object Value Update]: '${JSON.stringify(oldValue)}' convert to '${JSON.stringify(newValue)}'`,
  });
  delete object['__edited_record'];
  // console.log('oldValue and newValue', oldValue, newValue);
  // try{
  object['__edited_record'] = newEditedRecord;

  // object['__edited_record'] = object['__edited_record'] || [];
  // object['__edited_record'].push({
  //   key: index,
  //   type: `[Object Value Update]: '${JSON.stringify(oldValue)}' convert to '${JSON.stringify(newValue)}'`,
  // });
}

function addObject(object, newValue, flag) {
  console.log('addObject(object, newValue, flag)', object, newValue, flag)
  const newKey = `newKey-${guid()}`;
  if (flag.length === 0) {
    if (typeof newValue === 'object' && !Array.isArray(newValue)) {
      object[newKey] = { ...newValue };
    } else {
      object[newKey] = newValue;
    }
    console.log('object[index]', object);
    let newEditedRecord = object['__edited_record'] || [];
    newEditedRecord = [...newEditedRecord];
    newEditedRecord.push({
      key: newKey,
      type: `[Object Value Update]: create new value`,
    });
    delete object['__edited_record'];
    // console.log('oldValue and newValue', oldValue, newValue);
    // try{
    object['__edited_record'] = newEditedRecord;
    return;
  }
  while (flag.length > 1) {
    let index = flag.shift();
    index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
    object = object[index];
  }
  let index = flag.shift();
  index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
  // const oldValue = Object.assign(object[index], {});
  // const oldValue = {...object[index]};
  // if (object[index] === newValue) {
  //   return;
  // }
  // console.log("object['newValue']", object[index], object[index]['newValue'], newValue);
  console.log('newValue', newValue);
  if (typeof newValue === 'object' && !Array.isArray(newValue)) {
    console.log(1, object[index]);
    if (!Array.isArray(object[index])) {
      console.log(2);
      object[index][newKey] = {...newValue};

      let newEditedRecord = object[index]['__edited_record'] || [];
      newEditedRecord = [...newEditedRecord];
      newEditedRecord.push({
        key: newKey,
        type: `[Object Value Update]: create new value`,
      });
      delete object[index]['__edited_record'];
      // console.log('oldValue and newValue', oldValue, newValue);
      // try{
      object[index]['__edited_record'] = newEditedRecord;
    } else {
      console.log(3);
      object[index].push({...newValue});

      let newEditedRecord = object[index].filter(item => {
        if (item[0] === '__edited_record') {
          return true;
        }
      });
      console.log('newEditedRecord', newEditedRecord);
      if (newEditedRecord.length === 0) {
        newEditedRecord = ['__edited_record']
      } else {
        newEditedRecord = newEditedRecord[0];
        const indexNumber = object[index].indexOf(newEditedRecord);
        object[index].splice(indexNumber, 1);
      }
      // newEditedRecord = newEditedRecord.length === 0 ? ['__edited_record'] : newEditedRecord[0];

      newEditedRecord.push({
        key: newKey,
        type: `[Object Value Update]: create new value`,
      });

      object[index].push(newEditedRecord);
      return;
    }
  } else {
    console.log(1);
    // object[index][newKey] = newValue;
    if (!Array.isArray(object[index])) {
      object[index][newKey] = newValue;
      let newEditedRecord = object[index]['__edited_record'] || [];
      newEditedRecord = [...newEditedRecord];
      newEditedRecord.push({
        key: newKey,
        type: `[Object Value Update]: create new value`,
      });
      delete object[index]['__edited_record'];
      // console.log('oldValue and newValue', oldValue, newValue);
      // try{
      object[index]['__edited_record'] = newEditedRecord;
    } else {
      object[index].push(newValue);
      let newEditedRecord = object[index].filter(item => {
        if (item[0] === '__edited_record') {
          return true;
        }
      });
      if (newEditedRecord.length === 0) {
        newEditedRecord = ['__edited_record']
      } else {
        newEditedRecord = newEditedRecord[0];
        const indexNumber = object[index].indexOf(newEditedRecord);
        object[index].splice(indexNumber, 1);
      }
      // newEditedRecord = newEditedRecord.length === 0 ? ['__edited_record'] : newEditedRecord[0];

      newEditedRecord.push({
        key: newKey,
        type: `[Object Value Update]: create new value`,
      });

      object[index].push(newEditedRecord);
      return;
    }
  }
  console.log('object[index]', object[index]);
  // object[index]['__edited_record'] = object[index]['__edited_record'] || [];
  // // console.log('oldValue and newValue', oldValue, newValue);
  // // try{
  //   object[index]['__edited_record'].push({
  //     key: newKey,
  //     type: `[Object Value Update]: create new value`,
  //   });
  // // }catch(e){
  // //   // object['__edited_record'].push({
  // //   //   key: newKey,
  // //   //   type: `[Object Value Update]: create '${newValue}' and clone '${flag}' to it`,
  // //   // });
  // // }

  // let newEditedRecord = object[index]['__edited_record'] || [];
  // newEditedRecord = [...newEditedRecord];
  // newEditedRecord.push({
  //   key: newKey,
  //   type: `[Object Value Update]: create new value`,
  // });
  // delete object[index]['__edited_record'];
  // // console.log('oldValue and newValue', oldValue, newValue);
  // // try{
  // object[index]['__edited_record'] = newEditedRecord;
}

function adjustValueObject(object, flag, item, type) {
  console.log('adjustValueObject', object, flag, item, type);
  if (flag.length === 0) {
    object['__edited_record'] = object['__edited_record'] || [];
    if (type === 'recover remove') {
      object['__edited_record'] = object['__edited_record'].map(i => {
        console.log('item', i, item);
        if (i.key === item) {
          i.type = 'recover remove';
        }
        return i;
      });
      return;
    } else {
      let newEditedRecord = object['__edited_record'] || [];
      newEditedRecord = [...newEditedRecord];
      newEditedRecord.push({
        key: item,
        type,
      });
      delete object['__edited_record'];
      // console.log('oldValue and newValue', oldValue, newValue);
      // try{
      object['__edited_record'] = newEditedRecord;
      // object['__edited_record'].push({
      //   key: item,
      //   type,
      // });
      return;
    }
  }
  while (flag.length > 1) {
    let index = flag.shift();
    index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
    object = object[index];
  }
  let index = flag.shift();
  index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
  const objectType = Array.isArray(object[index]) ? 'Array' : 'Object';
  // object[index]['__edited_record'] = object[index]['__edited_record'] || [];
  console.log('adjustValueObject');
  if (type === 'recover remove') {
    if (objectType === 'Object') {
      object[index]['__edited_record'] = object[index]['__edited_record'] || [];
      object[index]['__edited_record'] = object[index]['__edited_record'].map(i => {
        console.log('item', i, item);
        if (i.key === item) {
          i.type = 'recover remove';
        }
        return i;
      });
    } else{
      let newEditedRecord = object[index].filter(item => {
        if (item[0] === '__edited_record') {
          return true;
        }
      });
      if (newEditedRecord.length === 0) {
        newEditedRecord = ['__edited_record', {
          key: item,
          type: 'recover remove',
        }];
      } else {
        newEditedRecord = newEditedRecord[0];
        const indexNumber = object[index].indexOf(newEditedRecord);
        object[index].splice(indexNumber, 1);
      }
      // newEditedRecord = newEditedRecord.length === 0 ? ['__edited_record'] : newEditedRecord[0];

      // newEditedRecord.push({
      //   key: newKey,
      //   type: `[Object Value Update]: create new value`,
      // });
      newEditedRecord.map(child => {
        if (child.key === item) {
          child.type = 'recover remove';
        }
        return child;
      })

      object[index].push(newEditedRecord);
    }
  } else {
    // object[index]['__edited_record'].push({
    //   key: item,
    //   type,
    // });
    if (objectType === 'Object') {
      let newEditedRecord = object[index]['__edited_record'] || [];
      newEditedRecord = [...newEditedRecord];
      newEditedRecord.push({
        key: item,
        type,
      });
      delete object[index]['__edited_record'];
      // console.log('oldValue and newValue', oldValue, newValue);
      // try{
      object[index]['__edited_record'] = newEditedRecord;
    } else {
      let newEditedRecord = object[index].filter(item => {
        if (item[0] === '__edited_record') {
          return true;
        }
      });
      if (newEditedRecord.length === 0) {
        newEditedRecord = ['__edited_record'];
      } else {
        newEditedRecord = newEditedRecord[0];
        const indexNumber = object[index].indexOf(newEditedRecord);
        object[index].splice(indexNumber, 1);
      }
      // newEditedRecord = newEditedRecord.length === 0 ? ['__edited_record'] : newEditedRecord[0];

      newEditedRecord.push({
        key: item,
        type,
      });
      object[index].push(newEditedRecord);
    }
  }
}

function updateKeyObject(object, newKey, flag, item) {
  if (newKey === item) {
    return;
  }
  if (flag.length === 0) {
    object[newKey] = object[item];

    let newEditedRecord = object['__edited_record'] || [];
    newEditedRecord = [...newEditedRecord];
    newEditedRecord.push({
      key: newKey,
      type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
    });
    delete object['__edited_record'];
    // console.log('oldValue and newValue', oldValue, newValue);
    // try{
    object['__edited_record'] = newEditedRecord;

    // object['__edited_record'] = object['__edited_record'] || [];
    // object['__edited_record'].push({
    //   key: newKey,
    //   type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
    // });
    delete object[item];
    return;
  }
  while (flag.length > 1) {
    let index = flag.shift();
    index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
    object = object[index];
  }
  let index = flag.shift();
  index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
  console.log('object[index][newKey] = object[index][item];', object[index], object[index][newKey], object[index][item])
  object[index][newKey] = object[index][item];

  let newEditedRecord = object[index]['__edited_record'] || [];
  newEditedRecord = [...newEditedRecord];
  newEditedRecord.push({
    key: newKey,
    type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
  });
  delete object[index]['__edited_record'];
  // console.log('oldValue and newValue', oldValue, newValue);
  // try{
  object[index]['__edited_record'] = newEditedRecord;

  // object[index]['__edited_record'] = object[index]['__edited_record'] || [];
  // object[index]['__edited_record'].push({
  //   key: newKey,
  //   type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
  // });
  delete object[index][item];
}

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
    },
  };
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.renderChild = this.renderChild.bind(this);
    this.jsonDataUPDATE = this.jsonDataUPDATE.bind(this);
    this.jsonDataTempAdd = this.jsonDataTempAdd.bind(this);
    this.jsonDataEditTempAdd = this.jsonDataEditTempAdd.bind(this);
    this.jsonDataREMOVE = this.jsonDataREMOVE.bind(this);
    this.addSubValueType = 'String';
    // jsonDataEditTempRemove: this.jsonDataEditTempRemove,
    const { option, crud, updateScope, modeOption } = props;
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
  }

  componentDidMount() {
    this.apiGET('aa', 'month1');
  }

  componentWillReceiveProps(nextProps) {
    const { option, crud, updateScope, modeOption } = nextProps;
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
  }

  modeTypeUpdate(type) {
    const { actions: act } = this.props;
    act.jsonDataAction.modeTypeUpdate(type);
  }

  apiGET() {
    const { actions: act, crud } = this.props;
    const { url, refernceFlag } = crud.read;
    request.get(url)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err || res.status !== 200) {
          console.log(new Error(err));
        } else {
          if (refernceFlag === '') {
            act.jsonDataAction.apiGET(res.body);
            return;
          }

          const arrayFlags = refernceFlag.split('>');
          let result = res.body;

          for (const item of arrayFlags) {
            result = result[item];
          }
          act.jsonDataAction.apiGET(result);
        }
      });
    // fetch(url, { method: type, data })
    //   .then(response => response.json())
    //   .then((jsonData) => {
    //
    //     if (refernceFlag === '') {
    //       actions.jsonDataAction.jsonDataGET(jsonData);
    //       return;
    //     }
    //
    //     const arrayFlags = refernceFlag.split('>');
    //     let result = jsonData;
    //
    //     for (const item of arrayFlags) {
    //       result = result[item];
    //     }
    //     actions.jsonDataAction.jsonDataGET(result);
    //   });
  }

  jsonDataUPDATE1(value, flags) {
    // url: 'cc',
    // type: 'POST',
    // refernceFlag: 'title',
    // id: 'month1', // default '';
    const { crud } = this.props;
    const { refernceFlag } = crud.update;
    const flagArray = flags.split('>');
    const refernceFlagArray = refernceFlag.split('>');
    const updateFlagArray = refernceFlagArray.map((item, i) => {
      // if (item === 'arrayIndex') {
      //   return flagArray[i]
      // }
      // if (item === flagArray[i] || (item === 'arrayIndex' && parseInt(flagArray[i]) !== NaN)) {
      //   return flagArray[i];
      // }
      if (item === 'arrayIndex' && !isNaN(parseInt(flagArray[i], 10))) {
        return flagArray[i];
      }
      return item;
    });
    console.log('updateFlagArray', updateFlagArray);
    // const data = new FormData();
    // data.append('json', JSON.stringify(updateData));

    //-------
    // request.post(url)
    //   // .set('Hashcash', hashCash)
    //   .set('Accept', 'application/json')
    //   // .set('Authorization', 'Bearer ' + isuntvCheck.token)
    //   .send(value)
    //   .end((err, res) => {
    //     if (err || res.status !== 200) {
    //       alert('失敗');
    //       console.log(new Error(err));
    //     } else {
    //       this.jsonDataGET();
    //     }
    //   });
    //-------

    // request.get(url)
    //   .set('Accept', 'application/json')
    //   .end((err, res) => {
    //     if (err || res.status !== 200) {
    //       console.log(new Error(err));
    //     } else {
    //       if (refernceFlag === '') {
    //         actions.jsonDataAction.jsonDataGET(res.body);
    //         return;
    //       }
    //
    //       const arrayFlags = refernceFlag.split('>');
    //       let result = res.body;
    //
    //       for (const item of arrayFlags) {
    //         result = result[item];
    //       }
    //       actions.jsonDataAction.jsonDataGET(result);
    //     }
    //   });

    // fetch(url, { method: type, body: data })
    //   .then((response) => {
    //     if (response.ok) {
    //       return response.blob();
    //     }
    //   });
      // .then((jsonData) => {
      //
      //   if (refernceFlag === '') {
      //     actions.jsonDataAction.jsonDataGET(jsonData);
      //     return;
      //   }
      //
      //   const arrayFlags = refernceFlag.split('>');
      //   let result = jsonData;
      //
      //   for (const item of arrayFlags) {
      //     result = result[item];
      //   }
      //   actions.jsonDataAction.jsonDataGET(result);
      //
      // });
  }

  jsonDataUPDATE(text, refernceFlag) {
    let parseText = text;
    if (text.indexOf('"') === 0) {
      parseText = text.replace(/"/g, '');
    } else {
      parseText = parseInt(text, 10);
    }
    const { actions: act } = this.props;
    const refernceFlagArray = refernceFlag.split('>');
    refernceFlagArray.shift();

    // const newState = Object.assign(this.state.data, {});
    const newState = { ...this.state.data };


    updateObject(newState, parseText, refernceFlagArray);


    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  jsonDataREMOVE(refernceFlagArray, item) {
    console.log('refernceFlagArray, item', refernceFlagArray, item);
    const { actions: act } = this.props;
    // const newState = Object.assign(this.state.data, {});
    const newState = { ...this.state.data };
    adjustValueObject(newState, refernceFlagArray, item, 'remove');
    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  jsonDataRECOVER(refernceFlagArray, item) {
    console.log('jsonDataRECOVER');
    const { actions: act } = this.props;
    // const newState = Object.assign(this.state.data, {});
    const newState = { ...this.state.data };
    adjustValueObject(newState, refernceFlagArray, item, 'recover remove');
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


    updateKeyObject(newState, text, refernceFlagArray, item);
    console.log('newState', newState);


    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  crudUrlUpdate(type, url) {
    const { actions: act } = this.props;
    act.jsonDataAction.crudUrlUpdate({ type, url });
  }

  crudTypeUpdate(type, crudType) {
    const { actions: act } = this.props;
    act.jsonDataAction.crudTypeUpdate({ type, crudType });
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

  jsonDataEditTempRemove(index) {
    const { actions: act } = this.props;
    act.jsonDataAction.jsonDataEditTempRemove();
  }

  jsonDataEditor() {

  }

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
      case 'Object':
        newValue = {};
        break;
      case 'Array':
        newValue = [];
        break;
      case 'Clone':
        let cloneSubValueType = this.cloneSubValueType;
        cloneSubValueType = cloneSubValueType.split('>');
        cloneSubValueType.shift();
        // newValue = Object.assign({}, data);
        newValue = { ...data };
        for (const item of cloneSubValueType) {
          newValue = newValue[item];
        }
        console.log('newValue----',newValue);
        break;
      default:
        newValue = '';
        break;
    }

    addObject(newState, newValue, refernceFlagArray);

    console.log('addObject newState', newState);
    act.jsonDataAction.jsonDataUPDATE(newState);

  }

  editTypeUpdate(type) {
    const { actions: act } = this.props;
    const { editScope, data } = this.state;
    console.log('editScope', editScope, type)
    const refernceFlagArray = editScope.flags.split('>');
    refernceFlagArray.shift();
    console.log('refernceFlagArray', refernceFlagArray);
    let flagValue = data;
    let newValue;
    if (type === 'Object') {
      newValue = {};
      for (const item of refernceFlagArray) {
        flagValue = flagValue[item];
      }
      if (typeof flagValue === 'object' && !Array.isArray(flagValue)) {
        return;
      }
      console.log('flagValue', flagValue);
      if (Array.isArray(flagValue)) {
        flagValue.forEach(function(data, i){
          console.log('data', data)
          if (data[0] === '__edited_record') {
            data.shift();
            newValue['__edited_record'] = data;
          } else {
            newValue[i] = data;
          }

        });
      } else {
        newValue[0] = flagValue;
      }
      // goback
    }
    if (type === 'Array') {
      newValue = [];
      for (const item of refernceFlagArray) {
        flagValue = flagValue[item];
      }
      console.log('flagValue1', flagValue);
      if (Array.isArray(flagValue)) {
        return;
      }
      if (typeof flagValue === 'object'){
        console.log('flagValue2', flagValue);
        for (const item in flagValue) {
          if (item === '__edited_record') {
            console.log(flagValue['__edited_record'])
            flagValue['__edited_record'].unshift('__edited_record');
            newValue.push(flagValue['__edited_record']);
            continue;
          }
          newValue.push(flagValue[item]);
        }
      } else {
        newValue.push(flagValue);
      }
      // goback
    }
    if (type === 'String') {
      newValue = '';
      for (const item of refernceFlagArray) {
        flagValue = flagValue[item];
      }
      if (typeof flagValue === 'number' || typeof flagValue === 'string') {
        return;
      }
      console.log('flagValue', flagValue);
      newValue = JSON.stringify(flagValue);
      // if (typeof flagValue === 'object'){
      //   console.log('flagValue', flagValue);
      //   for (const item in flagValue) {
      //     newValue.push(flagValue[item]);
      //   }
      // } else {
      //   newValue.push(flagValue);
      // }
      // goback
    }
    console.log('newValue', newValue);

    // const newState = Object.assign(this.state.data, {});
    const newState = { ...this.state.data };


    updateObject(newState, newValue, refernceFlagArray);

    act.jsonDataAction.jsonDataUPDATE(newState);
  }

  sendTypeUpdate(type) {
    const { actions: act } = this.props;
    act.jsonDataAction.sendTypeUpdate(type);
  }

  sendApiTabSwitch(tab) {
    const { actions: act } = this.props;
    act.jsonDataAction.sendApiTabSwitch(tab);
    // this.setState(update(this.state, {
    //   sendApi: {
    //     type: { $set: tab },
    //   },
    // }));
  }

  downloadJSONFile() {
    const { data } = this.state;
    let parseData = {...data};
    // let array = Object.keys(parseData);
    // for (const item of array) {
    //   if (item === '__edited_record') {
    //
    //   }
    //   if (parseData[item]) {
    //
    //   }
    // }
    this.parseData(parseData);
    console.log(parseData);

    const json = JSON.stringify(parseData);
    const blob = new Blob([json], {type: "application/json"});
    const url  = URL.createObjectURL(blob);
    console.log(url);
    window.open = url;

    if (document.getElementById('json-file')) {
      document.getElementById('json-file').href = url;
      document.getElementById('json-file').click();
      return;
    }
    const json_file = document.createElement('a');
    json_file.setAttribute('id', 'json-file');
    json_file.download    = "JSON_FILE.json";
    json_file.href        = url;
    json_file.textContent = "Download backup.json";
    document.body.appendChild(json_file);
    json_file.click();
  }

  parseData(data) {
    this.adjustData(data);
    if (typeof data === 'object' && Array.isArray(data)) {
      data.map(item => {
        this.parseData(item);
      });
    }
    if (typeof data === 'object' && !Array.isArray(data)) {
      let array = Object.keys(data);
      for (const item of array) {
        this.parseData(data[item]);
      }
    }
  }

  adjustData(data) {
    let removeList;
    // console.log('data', data, data[data.length - 1]);
    // if (typeof data !== 'object' ||  !data[data.length - 1]) {
    //   return;
    // }
    if (typeof data === 'object' && Array.isArray(data) && data.length !== 0) {
      if (data[data.length - 1][0] === '__edited_record') {
        console.log('1');
        removeList = data[data.length - 1].filter(item => {
          if (item.type === 'remove') {
            return true;
          }
        });
        removeList.map(item => {
          data.splice(item.key, 1);
          return item;
        });
        data.pop();
      }
    }
    if (typeof data === 'object' && !Array.isArray(data)) {
      console.log('2')
      let array = Object.keys(data);
      for (const item of array) {
        if (item === '__edited_record') {
          removeList = data.__edited_record.filter(item => {
            if (item.type === 'remove'){
              return true;
            }
          });
          removeList.map(item => {
            delete data[item.key];
            return item;
          });
          delete data['__edited_record'];
        }
      }
    }
  }

  renderChild(data, blockType, refernceFlag, modeOptionType) {
    const isArray = Array.isArray(data);
    let array = Object.keys(data);
    let keyTitle;
    let removeEditRecord = [];
    // if (array.length === 0) {
    //   return 'none';
    // }
    if (!isArray && typeof data === 'object' && data.__edited_record) {
      removeEditRecord = data.__edited_record.filter((item, i) => {
        if (item.type === 'remove') {
          return true;
        }
      });
      removeEditRecord = removeEditRecord.map(item => item.key);
    } else {
      if (Array.isArray(data)) {
        removeEditRecord = data;
        removeEditRecord = removeEditRecord.filter(item => {
          if (item[0] === '__edited_record') {
            return true;
          }
        });
        // removeEditRecord = removeEditRecord;
        if( removeEditRecord.length !== 0){
          removeEditRecord = removeEditRecord[0].map(item => {
            if(item.type === 'remove'){
              return JSON.stringify(item.key);
            }
          });
        }
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
        case 'object':
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

        case 'array':
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
                  jsonDataEditor: this.jsonDataEditor,
                  jsonDataEditTempAdd: this.jsonDataEditTempAdd,
                  // jsonDataEditTempRemove: this.jsonDataEditTempRemove,
                }}
              />
            </div>
          );

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

  renderRefernceEditFlagInputValue() {
    const { editScope } = this.state;
    return (
      <span className="flags" key={'Choice the key...editScope'}>{editScope.flags || 'Choice the key...'}</span>
    );
  }

  renderDataTextarea() {
    const { updateScope, data } = this.state;
    const type = updateScope.sendType;
    if (updateScope.flags.length === 0) {
      return '';
    }

    console.log('updateScope.flags', updateScope.flags);
    let flagArray = updateScope.flags.map((item, i) => {
      const array = item.split('>');
      let jsonData = data;
      array.shift();
      for (let i of array) {
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
    const { data, updateScope, crud, modeOption, editScope } = this.state;
    const blockType = Array.isArray(data) ? 'array' : 'default';
    console.log('modeOption', modeOption);
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
        <ObjectBlock
          data={data}
          methods={{ renderChild: this.renderChild, jsonDataEditTempAdd: this.jsonDataEditTempAdd }}
          blockType={blockType}
          modeType={modeOption.type}
        />


      <div className="setting-menu-edit" data-active={modeOption.type === 'edit' ? 'true' : 'false' }>
          <ul>
            <li>
              <div className="refernce-flag-input">
                {this.renderRefernceEditFlagInputValue()}
              </div>
            </li>
            <li>
              <div className="textarea">
                {this.renderDataEditTextarea()}
              </div>
            </li>
            <li>
              <span className="change_value_type">Change Value Type: </span>
              <br/>
              <span className="type-radio">
                <input type="radio" name="value-type" onChange={() => { this.editTypeUpdate('String'); }} defaultChecked />
                String
              </span>
              <span className="type-radio">
                <input type="radio" name="value-type" onChange={() => { this.editTypeUpdate('Array'); }} />
                Array
              </span>
              <span className="type-radio">
                <input type="radio" name="value-type" onChange={() => { this.editTypeUpdate('Object'); }} />
                Object
              </span>
            </li>
            <li className="clearfix">
              <span className="change_value_type">Add Sub Value: </span>
              <br/>
              <span className="type-radio">
                <input type="radio" name="sub-type" onChange={() => { this.addSubValueType = 'String'; }} defaultChecked="true" />
                String
              </span>
              <span className="type-radio">
                <input type="radio" name="sub-type" onChange={() => { this.addSubValueType = 'Array'; }} />
                Array
              </span>
              <span className="type-radio">
                <input type="radio" name="sub-type" onChange={() => { this.addSubValueType = 'Object'; }} />
                Object
              </span>
              <br/>
              <span className="type-radio">
                <input type="radio" name="sub-type" onChange={() => { this.addSubValueType = 'Clone'; }} />
                Clone Other
                <input className="clone_reference" type="text" name="type" placeholder={`ex. ${editScope.flags || '>month1'}>subkey`} onChange={(e) => { this.cloneSubValueType = e.target.value; }} />
              </span>
              <br/>
              <span className="type-radio float-right">
                <span className="add-button" onClick={() => { if ( !this.addSubValueType ){ alert('Choice sub value type'); return; } this.addSubValue(); }}>Add</span>
              </span>
            </li>
          </ul>
          <div className="text-center">
            <span className="json-button" onClick={() => { this.downloadJSONFile(); }}>Download JSON file</span>
          </div>
        </div>


        <div className="setting-menu-send" data-active={modeOption.type === 'send' ? 'true' : 'false' }>
          <ul>
            <li>
              <div className="refernce-flag-input">
                {this.renderRefernceFlagInputValue()}
              </div>
            </li>
            <li>
              <div className="textarea">
                {this.renderDataTextarea()}
              </div>
            </li>
            <li>
              <span className="type-radio">
                <input type="radio" name="type" onChange={() => { this.sendTypeUpdate('Default'); }} defaultChecked />
                Default
              </span>
              <span className="type-radio">
                <input type="radio" name="type" onChange={() => { this.sendTypeUpdate('Array'); }} />
                Array
              </span>
              <span className="type-radio">
                <input type="radio" name="type" onChange={() => { this.sendTypeUpdate('Object'); }} />
                Object
              </span>
            </li>
            <li>
              <ul className="send-type">
                <li
                  data-active={updateScope.sendApi.type === 'update' ? 'true' : ''}
                  onClick={() => {
                    this.sendApiTabSwitch('update');
                  }}
                >
                  Update
                </li>
                <li
                  data-active={updateScope.sendApi.type === 'create' ? 'true' : ''}
                  onClick={() => {
                    this.sendApiTabSwitch('create');
                  }}
                >
                  Create
                </li>
                <li
                  data-active={updateScope.sendApi.type === 'delete' ? 'true' : ''}
                  onClick={() => {
                    this.sendApiTabSwitch('delete');
                  }}
                >
                  Delete
                </li>
              </ul>
              <div className="send-setting">
                <div data-active={updateScope.sendApi.type === 'update' ? 'true' : ''} className="update">
                  <div className="api-url-option">
                    <select value={crud.update.type} onChange={(e) => { this.crudTypeUpdate('update', e.target.value); }}>
                      <option value={'POST'}>POST</option>
                      <option value={'GET'}>GET</option>
                    </select>
                    <input placeholder="Update API URL" value={crud.update.url} onChange={(e) => { this.crudUrlUpdate('update', e.target.value); }} />
                  </div>
                  <div className="api-send">
                    <div>Send</div>
                  </div>
                </div>
                <div data-active={updateScope.sendApi.type === 'create' ? 'true' : ''} className="create">
                  <div className="api-url-option">
                    <select value={crud.create.type} onChange={(e) => { this.crudTypeUpdate('create', e.target.value); }}>
                      <option value={'POST'}>POST</option>
                      <option value={'GET'}>GET</option>
                    </select>
                    <input placeholder="Create API URL" value={crud.create.url} onChange={(e) => { this.crudUrlUpdate('create', e.target.value); }} />
                  </div>
                  <div className="api-send">
                    <div>Send</div>
                  </div>
                </div>
                <div data-active={updateScope.sendApi.type === 'delete' ? 'true' : ''} className="delete">
                  <div className="api-url-option">
                    <select value={crud.delete.type} onChange={(e) => { this.crudTypeUpdate('delete', e.target.value); }}>
                      <option value={'DELETE'}>DELETE</option>
                      <option value={'POST'}>POST</option>
                      <option value={'GET'}>GET</option>
                    </select>
                    <input placeholder="Delete API URL" value={crud.delete.url} onChange={(e) => { this.crudUrlUpdate('delete', e.target.value); }} />
                  </div>
                  <div className="api-send">
                    <div>Send</div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        {/* <div className="createNew">
        </div> */}
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
