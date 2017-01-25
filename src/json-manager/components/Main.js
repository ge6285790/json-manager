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

function mapStateToProps(state) {
  console.log('state', state, state.option.updateScope.flags);
  return {
    updateScope: {
      flags: state.option.updateScope.flags,
    },
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
    // console.log(props);
    this.renderChild = this.renderChild.bind(this);
    this.jsonDataUPDATE = this.jsonDataUPDATE.bind(this);
    const { option, crud } = props;
    this.state = {
      updateScope: {
        flags: option.updateScope.flags,
      },
      data: option.defaultData || {},
      crud,
    };
  }

  componentDidMount() {
    this.jsonDataGET('aa', 'month1');
  }

  componentWillReceiveProps(nextProps) {
    const { option, crud } = nextProps;
    this.state = {
      updateScope: {
        flags: option.updateScope.flags,
      },
      data: option.defaultData || {},
      crud,
    };
  }

  jsonDataGET() {
    const { actions, crud } = this.props;
    const { url, refernceFlag } = crud.read;
    request.get(url)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err || res.status !== 200) {
          console.log(new Error(err));
        } else {
          if (refernceFlag === '') {
            actions.jsonDataAction.jsonDataGET(res.body);
            return;
          }

          const arrayFlags = refernceFlag.split('>');
          let result = res.body;

          for (const item of arrayFlags) {
            result = result[item];
          }
          actions.jsonDataAction.jsonDataGET(result);
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
    const parseText = text.replace(/"/g, '');
    const { actions } = this.props;
    const refernceFlagArray = refernceFlag.split('>');
    refernceFlagArray.shift();

    const newState = Object.assign(this.state.data, {});

    function updateObject(object, newValue, flag) {
      while (flag.length > 1) {
        let index = flag.shift();
        index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
        object = object[index];
      }
      let index = flag.shift();
      index = isNaN(parseInt(index, 10)) ? index : parseInt(index, 10);
      object[index] = newValue;
    }
    updateObject(newState, parseText, refernceFlagArray);


    actions.jsonDataAction.jsonDataUPDATE(newState);
  }

  addNewKey(flags, value) {
    // let flag = { data };
    // for (let key in flags) {
    //   flag =
    // }
    // this.setState(update(this.state, {
    //   data
    // }))
  }

  renderChild(data, blockType, refernceFlag) {
    const isArray = Array.isArray(data);
    let array = Object.keys(data);
    let keyTitle;
    array = array.map((item, i) => {
      let flag = refernceFlag || '';

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
            <div className="object-child" key={key + i}>
              {/* <span>{key}: </span> */}
              <ObjectBlock
                refernceFlag={flag}
                data={key}
                keyTitle={keyTitle}
                blockType={'object'}
                methods={{
                  renderChild: this.renderChild,
                  jsonDataUPDATE: this.jsonDataUPDATE,
                }}
              />
            </div>
          );

        case 'array':
          keyTitle = blockType === 'array' ? '' : item;
          return (
            <div className="array-child" key={key + i}>
              <ArrayBlock
                refernceFlag={flag}
                data={key}
                keyTitle={keyTitle}
                blockType={'array'}
                methods={{
                  renderChild: this.renderChild,
                  jsonDataUPDATE: this.jsonDataUPDATE,
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
            <div className="string-child" key={key + i}>
              <StringBlock
                refernceFlag={flag}
                classNameString={`string-value ${stringClass} ${valueClass}`}
                value={value}
                keyTitle={title}
                methods={{
                  jsonDataUPDATE: this.jsonDataUPDATE,
                  // jsonDataUPDATE: this.jsonDataUPDATE,
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

  render() {
    const { data, updateScope } = this.state;
    const blockType = Array.isArray(data) ? 'array' : 'default';
    console.log('updateFlags', updateScope.flags, this.state);
    let refernceFlagInputValue = '';
    if (updateScope.flags.length !== 0) {
      refernceFlagInputValue = updateScope.flags.reduce((prev, next) => `${prev}, ${next}`);
    }
    console.log('refernceFlagInputValue', refernceFlagInputValue)
    return (
      <div className="json-manager" data-theme="dark">
        <ObjectBlock
          data={data}
          methods={{ renderChild: this.renderChild }}
          blockType={blockType}
        />
        <div className="settingMenu">
          <ul>
            <li></li>
            <li>
              <input
                className="refernceFlagInput"
                placeholder="Choice the key..."
                value={refernceFlagInputValue}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  option: React.PropTypes.object.isRequired,
  crud: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
