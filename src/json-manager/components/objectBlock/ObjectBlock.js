import React, { Component } from 'react';
import css from './objectBlock.scss';

// class ObjectBlock extends Component {
//   constructor(props) {
//     super(props);
//   }
//
//   render() {
//     let keyTitle = this.props.keyTitle || '';
//     keyTitle = keyTitle === '' ? '{' : `"${keyTitle}": {`;
//     const { blockType, refernceFlag } = this.props;
//     const { renderChild, jsonDataUPDATE, dataPrepare } = this.props.methods;
//     return (
//       <div className="object-block">
//         <span onClick={() => { dataPrepare(refernceFlag); }}>{keyTitle}</span>
//           {renderChild(this.props.data, blockType, refernceFlag)}
//         <span className="object-tail">{'}'}</span>
//       </div>
//     );
//   }
// }

const ObjectBlock = (props) => {
  let keyTitle = props.keyTitle || '';
  keyTitle = keyTitle === '' ? '{' : `"${keyTitle}": {`;
  const { blockType, refernceFlag, methods, modeType } = props;
  const { renderChild, jsonDataTempAdd, jsonDataEditTempAdd } = methods;
  const edited = props.keyTitle === '__edited_record' ? '__edited_record' : '';
  if (modeType === 'send') {
    return (
      <div className="object-block">
        <span onClick={() => { jsonDataTempAdd(refernceFlag); }}>{keyTitle}</span>
        {renderChild(props.data, blockType, refernceFlag, modeType)}
        <span className="object-tail">{'}'}</span>
      </div>
    );
  }
  return (
    <div className={`object-block ${edited}`} data-mode="edit">
      <span onClick={() => { jsonDataEditTempAdd(refernceFlag); }}>{keyTitle}</span>
      {renderChild(props.data, blockType, refernceFlag, modeType)}
      <span className="object-tail">{'}'}</span>
    </div>
  );
};

ObjectBlock.propTypes = {
  data: React.PropTypes.object.isRequired,
  // keyTitle: React.PropTypes.string.isRequired,
  blockType: React.PropTypes.string.isRequired,
  // refernceFlag: React.PropTypes.string.isRequired,
  methods: React.PropTypes.object.isRequired,
};


export default ObjectBlock;
