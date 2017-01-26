import React, { Component } from 'react';
import css from './arrayBlock.scss';

const ArrayBlock = (props) => {
  let keyTitle = props.keyTitle;
  keyTitle = `"${keyTitle}": [`;
  const { blockType, refernceFlag, methods } = props;
  const { renderChild, dataPrepare } = methods;
  return (
    <div className="array-block">
      <span onClick={() => { dataPrepare(refernceFlag); }}>{keyTitle}</span>
      {renderChild(props.data, blockType, refernceFlag)}
      <span className="array-tail">{']'}</span>
    </div>
  );
};

ArrayBlock.propTypes = {
  data: React.PropTypes.array.isRequired,
  keyTitle: React.PropTypes.string.isRequired,
  blockType: React.PropTypes.string.isRequired,
  refernceFlag: React.PropTypes.string.isRequired,
  methods: React.PropTypes.object.isRequired,
};

export default ArrayBlock;
