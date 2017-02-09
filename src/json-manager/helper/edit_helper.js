
/* eslint no-underscore-dangle: ["error", { "allow": ["__edited_record"] }] */

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x100)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function getFlagDataAndLastKey(object, flag) {
  console.log('---------getFlagDataAndLastKey---------');
  let obj = object;
  while (flag.length > 1) {
    let key = flag.shift();
    key = isNaN(parseInt(key, 10)) ? key : parseInt(key, 10);
    obj = obj[key];
  }

  let lastKey = flag.shift();
  lastKey = isNaN(parseInt(lastKey, 10)) ? lastKey : parseInt(lastKey, 10);

  return {
    obj,
    lastKey,
  };
}

function editedRecordUpdateInArray(object, data) {
  console.log('---------editedRecordUpdateInArray---------');
  const obj = object;
  let newEditedRecord = obj.filter((item) => {
    if (item[0] === '__edited_record') {
      return true;
    }
    return false;
  });
  if (newEditedRecord.length === 0) {
    newEditedRecord = ['__edited_record'];
  } else {
    newEditedRecord = newEditedRecord[0];
    const indexNumber = obj.indexOf(newEditedRecord);
    obj.splice(indexNumber, 1);
  }

  newEditedRecord.push(data);

  obj.push(newEditedRecord);
}

function editedRecordUpdateInObject(object, data) {
  console.log('---------editedRecordUpdateInObject---------');
  const obj = object;
  let newEditedRecord = obj.__edited_record || [];
  newEditedRecord = [...newEditedRecord];
  newEditedRecord.push(data);
  delete obj.__edited_record;

  obj.__edited_record = newEditedRecord;
}

export function updateObject(object, newValue, flag) {
  let obj = object;

  const flagDataAndLastKey = getFlagDataAndLastKey(obj, flag);
  const index = flagDataAndLastKey.lastKey;
  obj = flagDataAndLastKey.obj;

  /*
  Record old value
  */
  const oldValue = Object.assign(obj[index], {});

  /*
  if values are even, stop function
  */
  if (obj[index] === newValue) {
    return;
  }

  /*
  update new value
  */
  obj[index] = newValue;
  console.log('obj type', obj);

  if (Array.isArray(obj)) {
    const data = {
      key: index,
      type: `[Object Value Update]: '${JSON.stringify(oldValue)}' convert to '${JSON.stringify(newValue)}'`,
    };

    editedRecordUpdateInArray(obj, data);
    return;
  }

  // let newEditedRecord = obj.__edited_record || [];
  // newEditedRecord = [...newEditedRecord];
  // newEditedRecord.push({
  //   key: index,
  //   type: `[Object Value Update]: '${JSON.stringify(oldValue)}' convert to '${JSON.stringify(newValue)}'`,
  // });
  // delete obj.__edited_record;
  //
  // obj.__edited_record = newEditedRecord;

  const data = {
    key: index,
    type: `[Object Value Update]: '${JSON.stringify(oldValue)}' convert to '${JSON.stringify(newValue)}'`,
  };

  editedRecordUpdateInObject(obj, data);
}

export function addObject(object, newValue, flag) {
  console.log('addObject(object, newValue, flag)', object, newValue, flag);
  // let obj = object;
  const newKey = `newKey-${guid()}`;
  if (flag.length === 0) {
    if (typeof newValue === 'object' && !Array.isArray(newValue)) {
      object[newKey] = { ...newValue };
    } else {
      object[newKey] = newValue;
    }
    console.log('object[index]', object);
    // let newEditedRecord = object['__edited_record'] || [];
    // newEditedRecord = [...newEditedRecord];
    // newEditedRecord.push({
    //   key: newKey,
    //   type: `[Object Value Update]: create new value`,
    // });
    // delete object['__edited_record'];
    // // console.log('oldValue and newValue', oldValue, newValue);
    // // try{
    // object['__edited_record'] = newEditedRecord;

    const data = {
      key: newKey,
      type: `[Object Value Update]: create new value`,
    };

    editedRecordUpdateInObject(object, data);
    return;
  }
  // while (flag.length > 1) {
  //   let index = flag.shift();
  //   index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
  //   object = object[index];
  // }
  // let index = flag.shift();
  // index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);

  const flagDataAndLastKey = getFlagDataAndLastKey(object, flag);
  const index = flagDataAndLastKey.lastKey;
  object = flagDataAndLastKey.obj;

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
      object[index][newKey] = { ...newValue };
      //
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

      const data = {
        key: newKey,
        type: '[Object Value Update]: create new value',
      };

      editedRecordUpdateInObject(object[index], data);

    } else {
      console.log(3);
      object[index].push({...newValue});
      //
      // let newEditedRecord = object[index].filter(item => {
      //   if (item[0] === '__edited_record') {
      //     return true;
      //   }
      // });
      // console.log('newEditedRecord', newEditedRecord);
      // if (newEditedRecord.length === 0) {
      //   newEditedRecord = ['__edited_record']
      // } else {
      //   newEditedRecord = newEditedRecord[0];
      //   const indexNumber = object[index].indexOf(newEditedRecord);
      //   object[index].splice(indexNumber, 1);
      // }
      // // newEditedRecord = newEditedRecord.length === 0 ? ['__edited_record'] : newEditedRecord[0];
      //
      // newEditedRecord.push({
      //   key: newKey,
      //   type: `[Object Value Update]: create new value`,
      // });
      //
      // object[index].push(newEditedRecord);

      const data = {
        key: newKey,
        type: '[Object Value Update]: create new value',
      };

      editedRecordUpdateInArray(object[index], data);
      return;
    }
  } else {
    console.log(1);
    // object[index][newKey] = newValue;
    if (!Array.isArray(object[index])) {
      object[index][newKey] = newValue;
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

      const data = {
        key: newKey,
        type: '[Object Value Update]: create new value',
      };

      editedRecordUpdateInObject(object[index], data);
    } else {
      object[index].push(newValue);
      // let newEditedRecord = object[index].filter(item => {
      //   if (item[0] === '__edited_record') {
      //     return true;
      //   }
      // });
      // if (newEditedRecord.length === 0) {
      //   newEditedRecord = ['__edited_record']
      // } else {
      //   newEditedRecord = newEditedRecord[0];
      //   const indexNumber = object[index].indexOf(newEditedRecord);
      //   object[index].splice(indexNumber, 1);
      // }
      // // newEditedRecord = newEditedRecord.length === 0 ? ['__edited_record'] : newEditedRecord[0];
      //
      // newEditedRecord.push({
      //   key: newKey,
      //   type: `[Object Value Update]: create new value`,
      // });
      //
      // object[index].push(newEditedRecord);

      const data = {
        key: newKey,
        type: `[Object Value Update]: create new value`,
      };

      editedRecordUpdateInArray(object[index], data);
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

export function adjustValueObject(object, flag, item, type) {
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
      // let newEditedRecord = object['__edited_record'] || [];
      // newEditedRecord = [...newEditedRecord];
      // newEditedRecord.push({
      //   key: item,
      //   type,
      // });
      // delete object['__edited_record'];
      // // console.log('oldValue and newValue', oldValue, newValue);
      // // try{
      // object['__edited_record'] = newEditedRecord;
      // // object['__edited_record'].push({
      // //   key: item,
      // //   type,
      // // });

      const data = {
        key: item,
        type,
      };

      editedRecordUpdateInObject(object, data);
      return;
    }
  }
  // while (flag.length > 1) {
  //   let index = flag.shift();
  //   index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
  //   object = object[index];
  // }
  // let index = flag.shift();
  // index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);

  const flagDataAndLastKey = getFlagDataAndLastKey(object, flag);
  const index = flagDataAndLastKey.lastKey;
  object = flagDataAndLastKey.obj;

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
      // let newEditedRecord = object[index]['__edited_record'] || [];
      // newEditedRecord = [...newEditedRecord];
      // newEditedRecord.push({
      //   key: item,
      //   type,
      // });
      // delete object[index]['__edited_record'];
      // // console.log('oldValue and newValue', oldValue, newValue);
      // // try{
      // object[index]['__edited_record'] = newEditedRecord;

      const data = {
        key: item,
        type,
      };

      editedRecordUpdateInObject(object[index], data);
      return;
    } else {
      // let newEditedRecord = object[index].filter(item => {
      //   if (item[0] === '__edited_record') {
      //     return true;
      //   }
      // });
      // if (newEditedRecord.length === 0) {
      //   newEditedRecord = ['__edited_record'];
      // } else {
      //   newEditedRecord = newEditedRecord[0];
      //   const indexNumber = object[index].indexOf(newEditedRecord);
      //   object[index].splice(indexNumber, 1);
      // }
      // // newEditedRecord = newEditedRecord.length === 0 ? ['__edited_record'] : newEditedRecord[0];
      //
      // newEditedRecord.push({
      //   key: item,
      //   type,
      // });
      // object[index].push(newEditedRecord);

      const data = {
        key: item,
        type,
      };

      editedRecordUpdateInArray(object[index], data);
    }
  }
}

export function updateKeyObject(object, newKey, flag, item) {
  if (newKey === item) {
    return;
  }
  if (flag.length === 0) {
    object[newKey] = object[item];

    // let newEditedRecord = object['__edited_record'] || [];
    // newEditedRecord = [...newEditedRecord];
    // newEditedRecord.push({
    //   key: newKey,
    //   type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
    // });
    // delete object['__edited_record'];
    // // console.log('oldValue and newValue', oldValue, newValue);
    // // try{
    // object['__edited_record'] = newEditedRecord;
    //
    // // object['__edited_record'] = object['__edited_record'] || [];
    // // object['__edited_record'].push({
    // //   key: newKey,
    // //   type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
    // // });
    const data = {
      key: newKey,
      type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
    };

    editedRecordUpdateInObject(object, data);

    delete object[item];


    return;
  }

  // while (flag.length > 1) {
  //   let index = flag.shift();
  //   index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
  //   object = object[index];
  // }
  // let index = flag.shift();
  // index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);

  const flagDataAndLastKey = getFlagDataAndLastKey(object, flag);
  const index = flagDataAndLastKey.lastKey;
  object = flagDataAndLastKey.obj;

  console.log('object[index][newKey] = object[index][item];', object[index], object[index][newKey], object[index][item])
  object[index][newKey] = object[index][item];

  // let newEditedRecord = object[index]['__edited_record'] || [];
  // newEditedRecord = [...newEditedRecord];
  // newEditedRecord.push({
  //   key: newKey,
  //   type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
  // });
  // delete object[index]['__edited_record'];
  // // console.log('oldValue and newValue', oldValue, newValue);
  // // try{
  // object[index]['__edited_record'] = newEditedRecord;

  const data = {
    key: newKey,
    type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
  };

  editedRecordUpdateInObject(object[index], data);

  // object[index]['__edited_record'] = object[index]['__edited_record'] || [];
  // object[index]['__edited_record'].push({
  //   key: newKey,
  //   type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
  // });
  delete object[index][item];
}
