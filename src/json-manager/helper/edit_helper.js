
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

// export function addObject(object, newValue, flag) {
//   console.log('addObject(object, newValue, flag)', object, newValue, flag);
//   let obj = object;
//   const newKey = `newKey-${guid()}`;
//   if (flag.length === 0) {
//     if (typeof newValue === 'object' && !Array.isArray(newValue)) {
//       obj[newKey] = { ...newValue };
//     } else {
//       obj[newKey] = newValue;
//     }
//     console.log('object[index]', obj);
//
//     const data = {
//       key: newKey,
//       type: '[Object Value Update]: create new value',
//     };
//
//     editedRecordUpdateInObject(obj, data);
//     return;
//   }
//
//   const flagDataAndLastKey = getFlagDataAndLastKey(obj, flag);
//   const index = flagDataAndLastKey.lastKey;
//   obj = flagDataAndLastKey.obj;
//
//   console.log('newValue', newValue);
//   if (typeof newValue === 'object' && !Array.isArray(newValue)) {
//     console.log(1, obj[index]);
//     if (!Array.isArray(obj[index])) {
//       console.log(2);
//       obj[index][newKey] = { ...newValue };
//
//       const data = {
//         key: newKey,
//         type: '[Object Value Update]: create new value',
//       };
//
//       editedRecordUpdateInObject(obj[index], data);
//     } else {
//       console.log(3);
//       obj[index].push({ ...newValue });
//
//       const data = {
//         key: newKey,
//         type: '[Object Value Update]: create new value',
//       };
//
//       editedRecordUpdateInArray(obj[index], data);
//       return;
//     }
//   } else {
//     console.log(1);
//     // object[index][newKey] = newValue;
//     if (!Array.isArray(obj[index])) {
//       obj[index][newKey] = newValue;
//
//       const data = {
//         key: newKey,
//         type: '[Object Value Update]: create new value',
//       };
//
//       editedRecordUpdateInObject(obj[index], data);
//     } else {
//       obj[index].push(newValue);
//
//       const data = {
//         key: newKey,
//         type: '[Object Value Update]: create new value',
//       };
//
//       editedRecordUpdateInArray(obj[index], data);
//       return;
//     }
//   }
//   console.log('object[index]', obj[index]);
// }

export function addObject(object, newValue, flag) {
  console.log('addObject(object, newValue, flag)', object, newValue, flag);
  let obj = object;
  const newKey = `newKey-${guid()}`;

  const newValueType = (typeof newValue === 'object' && !Array.isArray(newValue)) ? 'object' : 'array';
  let flagType;
  let flagDataAndLastKey;
  let index;

  if (flag.length === 0) {
    flagType = 'root';
  } else {
    flagDataAndLastKey = getFlagDataAndLastKey(obj, flag);
    index = flagDataAndLastKey.lastKey;
    obj = flagDataAndLastKey.obj;
    console.log('obj-----', flagDataAndLastKey, typeof obj === 'object', !Array.isArray(obj))
    flagType = (typeof obj[index] === 'object' && !Array.isArray(obj[index])) ? 'object' : 'array';
  }

  console.log('--------', `${flagType}-${newValueType}`);
  switch (`${flagType}-${newValueType}`) {
    case 'root-object': {
      obj[newKey] = { ...newValue };
      const data = {
        key: newKey,
        type: '[Object Value Update]: create new value',
      };

      editedRecordUpdateInObject(obj, data);
      return;
    }
    case 'root-array': {
      obj[newKey] = newValue;
      const data = {
        key: newKey,
        type: '[Object Value Update]: create new value',
      };

      editedRecordUpdateInObject(obj, data);
      return;
    }
    case 'object-object': {
      obj[index][newKey] = { ...newValue };

      const data = {
        key: newKey,
        type: '[Object Value Update]: create new value',
      };

      editedRecordUpdateInObject(obj[index], data);
      return;
    }
    case 'object-array': {
      // obj[index].push({ ...newValue });
      //
      // const data = {
      //   key: newKey,
      //   type: '[Object Value Update]: create new value',
      // };
      //
      // editedRecordUpdateInArray(obj[index], data);
      // return;
      // obj[index][newKey] = { ...newValue };
      obj[index][newKey] = newValue;

      const data = {
        key: newKey,
        type: '[Object Value Update]: create new value',
      };

      editedRecordUpdateInObject(obj[index], data);
      return;
    }
    case 'array-object': {
      obj[index].push(newValue);

      const data = {
        key: newKey,
        type: '[Object Value Update]: create new value',
      };

      editedRecordUpdateInArray(obj[index], data);
      return;
    }
    case 'array-array': {
      obj[index].push(newValue);

      const data = {
        key: newKey,
        type: '[Object Value Update]: create new value',
      };

      editedRecordUpdateInArray(obj[index], data);
      return;
    }
    default:
      break;
  }

  // const newKey = `newKey-${guid()}`;
  // if (flag.length === 0) {
  //   if (typeof newValue === 'object' && !Array.isArray(newValue)) {
  //     obj[newKey] = { ...newValue };
  //   } else {
  //     obj[newKey] = newValue;
  //   }
  //   console.log('object[index]', obj);
  //
  //   const data = {
  //     key: newKey,
  //     type: '[Object Value Update]: create new value',
  //   };
  //
  //   editedRecordUpdateInObject(obj, data);
  //   return;
  // }
  //
  // const flagDataAndLastKey = getFlagDataAndLastKey(obj, flag);
  // const index = flagDataAndLastKey.lastKey;
  // obj = flagDataAndLastKey.obj;
  //
  // console.log('newValue', newValue);
  // if (typeof newValue === 'object' && !Array.isArray(newValue)) {
  //   console.log(1, obj[index]);
  //   if (!Array.isArray(obj[index])) {
  //     console.log(2);
  //     obj[index][newKey] = { ...newValue };
  //
  //     const data = {
  //       key: newKey,
  //       type: '[Object Value Update]: create new value',
  //     };
  //
  //     editedRecordUpdateInObject(obj[index], data);
  //   } else {
  //     console.log(3);
  //     obj[index].push({ ...newValue });
  //
  //     const data = {
  //       key: newKey,
  //       type: '[Object Value Update]: create new value',
  //     };
  //
  //     editedRecordUpdateInArray(obj[index], data);
  //     return;
  //   }
  // } else {
  //   console.log(1);
  //   // object[index][newKey] = newValue;
  //   if (!Array.isArray(obj[index])) {
  //     obj[index][newKey] = newValue;
  //
  //     const data = {
  //       key: newKey,
  //       type: '[Object Value Update]: create new value',
  //     };
  //
  //     editedRecordUpdateInObject(obj[index], data);
  //   } else {
  //     obj[index].push(newValue);
  //
  //     const data = {
  //       key: newKey,
  //       type: '[Object Value Update]: create new value',
  //     };
  //
  //     editedRecordUpdateInArray(obj[index], data);
  //     return;
  //   }
  // }
  console.log('object[index]', obj[index]);
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

      const data = {
        key: item,
        type,
      };

      editedRecordUpdateInObject(object, data);
      return;
    }
  }

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

      newEditedRecord.map(child => {
        if (child.key === item) {
          child.type = 'recover remove';
        }
        return child;
      })

      object[index].push(newEditedRecord);
    }
  } else {
    if (objectType === 'Object') {
      const data = {
        key: item,
        type,
      };

      editedRecordUpdateInObject(object[index], data);
      return;
    } else {

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

    const data = {
      key: newKey,
      type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
    };

    editedRecordUpdateInObject(object, data);

    delete object[item];

    return;
  }

  const flagDataAndLastKey = getFlagDataAndLastKey(object, flag);
  const index = flagDataAndLastKey.lastKey;
  object = flagDataAndLastKey.obj;

  console.log('object[index][newKey] = object[index][item];', object[index], object[index][newKey], object[index][item])
  object[index][newKey] = object[index][item];

  const data = {
    key: newKey,
    type: `[Object Key Update]: '${item}' convert to '${newKey}'`,
  };

  editedRecordUpdateInObject(object[index], data);

  delete object[index][item];
}
