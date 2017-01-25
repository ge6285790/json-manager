import React, { Component } from 'react';
import css from './objectBlock.scss';

class ObjectBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let keyTitle = this.props.keyTitle || '';
    keyTitle = keyTitle === '' ? '{' : `"${keyTitle}": {`;
    const { blockType, refernceFlag } = this.props;
    const { renderChild, jsonDataUPDATE } = this.props.methods;
    return (
      <div className="object-block">
        <span onClick={() => { jsonDataUPDATE(refernceFlag); }}>{keyTitle}</span>
          {renderChild(this.props.data, blockType, refernceFlag)}
        <span className="object-tail">{'}'}</span>
      </div>
    );
  }
}

export default ObjectBlock;
