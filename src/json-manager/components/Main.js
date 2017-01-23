import React, { Component } from 'react';
import ObjectBlock from './objectBlock/ObjectBlock';
import ArrayBlock from './arrayBlock/ArrayBlock';
import update from 'react-addons-update';

class Main extends Component {
  constructor(props) {
    super(props);
    this.renderChild = this.renderChild.bind(this);
    const { option, crud } = props.data;
    this.state = {
      data: option.defaultData || {},
      crud,
    };
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

  renderChild(data) {
    const isArray = Array.isArray(data);
    let array = Object.keys(data);
    array = array.map((item, i) => {
      const key = data[item];
      let type = typeof key;
      if (type === 'object' && Array.isArray(key)) {
        type = 'array';
      }
      switch (type) {
        case 'object':
          return (
            <div className="object-child" key={key + i}>
              {/* <span>{key}: </span> */}
              <ObjectBlock
                data={key}
                keyTitle={item}
                methods={{ renderChild: this.renderChild }}
              />
            </div>
          );
        case 'array':
          return (
            <div className="array-child" key={key + i}>
              {/* <span>{key}: </span> */}
              <ArrayBlock
                data={key}
                keyTitle={item}
                methods={{ renderChild: this.renderChild }}
              />
            </div>
          );
        default:
          const value = typeof key === 'number' ? key : `"${key}"`;
          const valueClass = typeof key === 'number' ? 'value' : '';
          const title = isArray ? '' : `"${item}": `;
          const stringClass = title === '' ? '' : 'padding-left';
          return (
            <div className="string-child" key={key + i}>
              <span>{title}</span>
              <span className={`string-value ${stringClass} ${valueClass}`}>{value}</span>,
            </div>
          );
      }
    });
    return array;
  }

  render() {
    return (
      <div className="json-manager">
        <ObjectBlock data={this.state.data} methods={{ renderChild: this.renderChild }} />
      </div>
    );
  }
}

export default Main;
