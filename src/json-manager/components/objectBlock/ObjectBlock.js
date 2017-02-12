import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import css from './objectBlock.scss';

// const ObjectBlock = (props) => {
//   console.log('aa');
//   let keyTitle = props.keyTitle || '';
//   keyTitle = keyTitle === '' ? '{' : `"${keyTitle}": {`;
//   const { blockType, refernceFlag, methods, modeType } = props;
//   const { renderChild, jsonDataTempAdd, jsonDataEditTempAdd } = methods;
//   const edited = props.keyTitle === '__edited_record' ? '__edited_record' : '';
//   if (modeType === 'send') {
//     return (
//       <div className={`object-block ${edited}`}>
//         <span onClick={() => { jsonDataTempAdd(refernceFlag); }}>{keyTitle}</span>
//         {renderChild(props.data, blockType, refernceFlag, modeType)}
//         <span className="object-tail">{'}'}</span>
//       </div>
//     );
//   }
//   return (
//     <div className={`object-block ${edited}`} data-mode="edit">
//       <span onClick={() => { jsonDataEditTempAdd(refernceFlag); }}>{keyTitle}</span>
//       {renderChild(props.data, blockType, refernceFlag, modeType)}
//       <span className="object-tail">{'}'}</span>
//     </div>
//   );
// };

class ObjectBlock extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.modeType === this.props.modeType && nextProps.modeType === 'send') {
      console.log('-----not update----');
      return false;
    }
    return true;
  }

  render() {
    // console.log('class ObjectBlock');
    let keyTitle = this.props.keyTitle || '';
    keyTitle = keyTitle === '' ? '{' : `"${keyTitle}": {`;
    const { blockType, refernceFlag, methods, modeType } = this.props;
    const { renderChild, jsonDataTempAdd, jsonDataEditTempAdd } = methods;
    const edited = this.props.keyTitle === '__edited_record' ? '__edited_record' : '';
    if (modeType === 'send') {
      return (
        <div className={`object-block ${edited}`}>
          <span onClick={() => { jsonDataTempAdd(refernceFlag); }}>{keyTitle}</span>
          {renderChild(this.props.data, blockType, refernceFlag, modeType)}
          <span className="object-tail">{'}'}</span>
        </div>
      );
    }
    return (
      <div className={`object-block ${edited}`} data-mode="edit">
        <span onClick={() => { jsonDataEditTempAdd(refernceFlag); }}>{keyTitle}</span>
        {renderChild(this.props.data, blockType, refernceFlag, modeType)}
        <span className="object-tail">{'}'}</span>
      </div>
    );
  }
}

ObjectBlock.propTypes = {
  data: React.PropTypes.object.isRequired,
  keyTitle: React.PropTypes.string.isRequired,
  blockType: React.PropTypes.string.isRequired,
  refernceFlag: React.PropTypes.string.isRequired,
  methods: React.PropTypes.object.isRequired,
  modeType: React.PropTypes.string.isRequired,
};


export default ObjectBlock;
