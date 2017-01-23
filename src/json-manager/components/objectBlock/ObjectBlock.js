import React, { Component } from 'react';
import css from './objectBlock.scss';

class ObjectBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let keyTitle = this.props.keyTitle || '';
    keyTitle = keyTitle === '' ? '{' : `"${keyTitle}": {`;
    const { renderChild } = this.props.methods;
    return (
      <div className="object-block">
        <span>{keyTitle}</span>
        {renderChild(this.props.data)}
        <span className="object-tail">{'}'}</span>
      </div>
    );
  }
}

export default ObjectBlock;
