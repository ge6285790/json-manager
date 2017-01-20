import React, { Component } from 'react';
import css from './objectBlock.scss';

class ObjectBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="object-block">
        <span>{'{'}</span>

        <span>{'}'}</span>
      </div>
    );
  }
}

export default ObjectBlock;
