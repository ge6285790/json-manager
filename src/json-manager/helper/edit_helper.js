
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

  /*
  update edited record

  if obj is array
  */
  if (Array.isArray(obj)) {
    const data = {
      key: index,
      type: `[Object Value Update]: '${JSON.stringify(oldValue)}' convert to '${JSON.stringify(newValue)}'`,
    };

    editedRecordUpdateInArray(obj, data);
    return;
  }

  /*
  update edited record

  if obj is object or string
  */
  const data = {
    key: index,
    type: `[Object Value Update]: '${JSON.stringify(oldValue)}' convert to '${JSON.stringify(newValue)}'`,
  };

  editedRecordUpdateInObject(obj, data);
}

export function addObject(object, newValue, flag) {
  console.log('addObject(object, newValue, flag)', object, newValue, flag);
  let obj = object;
  const newKey = `newKey-${guid()}`;

  let flagType;
  let flagDataAndLastKey;
  let index;
  let newValueType;
  const data = {
    key: newKey,
  };

  if (typeof newValue === 'object' && !Array.isArray(newValue)) {
    newValueType = 'object';
    data.type = '[Value Update]: create new object';
  } else if (typeof newValue === 'object' && Array.isArray(newValue)) {
    newValueType = 'array';
    data.type = '[Value Update]: create new array';
  } else if (typeof newValue === 'string') {
    newValueType = 'string';
    data.type = '[Value Update]: create new string';
  } else {
    newValueType = typeof newValue;
    data.type = `[Value Update]: create new ${newValueType}`;
  }

  if (flag.length === 0) {
    flagType = 'root';
  } else {
    flagDataAndLastKey = getFlagDataAndLastKey(obj, flag);
    index = flagDataAndLastKey.lastKey;
    obj = flagDataAndLastKey.obj;
    console.log('obj-----', flagDataAndLastKey, typeof obj === 'object', !Array.isArray(obj));
    flagType = (typeof obj[index] === 'object' && !Array.isArray(obj[index])) ? 'object' : 'array';
  }

  console.log('--------', `${flagType}-${newValueType}`);
  switch (`${flagType}-${newValueType}`) {
    case 'root-object': {
      obj[newKey] = { ...newValue };
      editedRecordUpdateInObject(obj, data);
      return;
    }
    case 'root-array': {
      obj[newKey] = newValue;
      editedRecordUpdateInObject(obj, data);
      return;
    }
    case 'root-string': {
      obj[newKey] = newValue;
      editedRecordUpdateInObject(obj, data);
      return;
    }
    case 'object-object': {
      obj[index][newKey] = { ...newValue };
      editedRecordUpdateInObject(obj[index], data);
      return;
    }
    case 'object-array': {
      obj[index][newKey] = newValue;
      editedRecordUpdateInObject(obj[index], data);
      return;
    }
    case 'object-string': {
      obj[index][newKey] = newValue;
      editedRecordUpdateInObject(obj[index], data);
      return;
    }
    case 'array-object': {
      obj[index].push(newValue);
      editedRecordUpdateInArray(obj[index], data);
      return;
    }
    case 'array-array': {
      obj[index].push(newValue);
      editedRecordUpdateInArray(obj[index], data);
      return;
    }
    case 'array-string': {
      obj[index].push(newValue);
      editedRecordUpdateInArray(obj[index], data);
      return;
    }
    default: {
      obj[index].push(newValue);
      editedRecordUpdateInArray(obj[index], data);
      return;
    }
  }
  console.log('object[index]', obj[index]);
}

export function adjustValueObject(object, flag, item, type) {
  console.log('adjustValueObject', object, flag, item, type);
  let obj = object;
  let flagType;
  let flagDataAndLastKey;
  let index;
  let newValueType;
  const data = {
    key: item,
  };

  if (flag.length === 0) {
    flagType = 'root';

    obj.__edited_record = obj.__edited_record || [];
  } else {
    flagDataAndLastKey = getFlagDataAndLastKey(obj, flag);
    index = flagDataAndLastKey.lastKey;
    obj = flagDataAndLastKey.obj;
    console.log('obj-----', flagDataAndLastKey, typeof obj === 'object', !Array.isArray(obj));
    flagType = (typeof obj[index] === 'object' && !Array.isArray(obj[index])) ? 'object' : 'array';
  }

  console.log('${flagType}-${type}', `${flagType}-${type}`);
  switch (`${flagType}-${type}`) {
    case 'root-recover remove': {
      obj.__edited_record = obj.__edited_record.map((i) => {
        console.log('item', i, item);
        const value = i;
        if (value.key === item) {
          value.type = 'recover remove';
        }
        return value;
      });
      return;
    }
    case 'root-remove': {
      data.type = type;

      editedRecordUpdateInObject(obj, data);
      return;
    }
    case 'object-recover remove': {
      obj[index].__edited_record = obj[index].__edited_record || [];
      obj[index].__edited_record = obj[index].__edited_record.map((i) => {
        const value = i;
        if (value.key === item) {
          value.type = 'recover remove';
        }
        return value;
      });
      return;
    }
    case 'object-remove': {
      data.type = type;

      editedRecordUpdateInObject(obj[index], data);
      return;
    }
    case 'array-recover remove': {
      let newEditedRecord = obj[index].filter((i) => {
        if (i[0] === '__edited_record') {
          return true;
        }
        return false;
      });
      if (newEditedRecord.length === 0) {
        newEditedRecord = ['__edited_record', {
          key: item,
          type: 'recover remove',
        }];
      } else {
        newEditedRecord = newEditedRecord[0];
        const indexNumber = obj[index].indexOf(newEditedRecord);
        obj[index].splice(indexNumber, 1);
      }

      newEditedRecord.map((i) => {
        const value = i;
        if (value.key === item) {
          value.type = 'recover remove';
        }
        return value;
      });

      obj[index].push(newEditedRecord);
      return;
    }
    case 'array-remove': {
      data.type = type;

      editedRecordUpdateInArray(obj[index], data);
      break;
    }
    default: {
      break;
    }
  }
}

export function updateKeyObject(object, newKey, flag, item) {
  let obj = object;
  if (newKey === item) {
    return;
  }
  if (flag.length === 0) {
    obj[newKey] = obj[item];

    const data = {
      key: newKey,
      type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
    };

    editedRecordUpdateInObject(obj, data);

    delete obj[item];

    return;
  }

  const flagDataAndLastKey = getFlagDataAndLastKey(obj, flag);
  const index = flagDataAndLastKey.lastKey;
  obj = flagDataAndLastKey.obj;

  console.log('object[index][newKey] = object[index][item];', obj[index], obj[index][newKey], obj[index][item])
  obj[index][newKey] = obj[index][item];

  const data = {
    key: newKey,
    type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
  };

  editedRecordUpdateInObject(obj[index], data);

  delete obj[index][item];
}
