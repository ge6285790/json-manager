import React, { Component } from 'react';
import css from './arrayBlock.scss';

class ArrayBlock extends Component {
  constructor() {
    super();
  }

  render() {
    let keyTitle = this.props.keyTitle;
    keyTitle = `"${keyTitle}": [`;
    const { renderChild } = this.props.methods;
    return (
      <div className="array-block">
        <span>{keyTitle}</span>
        {renderChild(this.props.data)}
        <span className="array-tail">{']'}</span>
      </div>
    );
  }
}

export default ArrayBlock;
