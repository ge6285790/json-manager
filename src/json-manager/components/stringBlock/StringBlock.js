import React, { Component } from 'react';
import css from './stringBlock.scss';

class StringBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const { renderChild } = this.props.methods;
    const { classNameString, value, methods, refernceFlag } = this.props;
    return (
      <span
        id="sim-input"
        className={classNameString}
        contentEditable="true"
        onInput={(e) => { console.log(e.target.innerText); }}
        onBlur={(e) => {
          console.log('aaa', e.target);
          methods.jsonDataUPDATE(e.target.innerText, refernceFlag);
        }}
      >
        {value}
      </span>
    );
  }
}

export default StringBlock;
