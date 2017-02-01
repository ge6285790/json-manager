import React, { Component } from 'react';
import css from './arrayBlock.scss';

const ArrayBlock = (props) => {
  let keyTitle = props.keyTitle;
  // keyTitle = `"${keyTitle}": [`;
  keyTitle = keyTitle === '' ? '[' : `"${keyTitle}": [`;
  const { blockType, refernceFlag, methods, modeType } = props;
  const { renderChild, jsonDataTempAdd, jsonDataEditTempAdd } = methods;
  const edited = props.keyTitle === '__edited_record' ? '__edited_record' : '';
  if (modeType === 'send') {
    return (
      <div className="array-block">
        <span
          onClick={() => {
            jsonDataTempAdd(refernceFlag);
          }}
        >
          {keyTitle}
        </span>

        {renderChild(props.data, blockType, refernceFlag, modeType)}
        <span className="array-tail">{']'}</span>
      </div>
    );
  }
  return (
    <div data-mode="edit" className={`array-block ${edited}`}>
      <span
        onClick={() => {
          jsonDataEditTempAdd(refernceFlag);
          // console.log('edit');
        }}
      >
        {keyTitle}
      </span>
      {renderChild(props.data, blockType, refernceFlag, modeType)}
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
