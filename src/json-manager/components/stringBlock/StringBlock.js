import React, { Component } from 'react';
import css from './stringBlock.scss';

class StringBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const { renderChild } = this.props.methods;
    const { classNameString, value, methods, refernceFlag, keyTitle } = this.props;
    const { jsonDataUPDATE } = methods;
    return (
      <span className="string-block">
        <span onClick={() => { jsonDataUPDATE(refernceFlag); }}>{keyTitle}</span>
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
      </span>
    );
  }
}

export default StringBlock;
