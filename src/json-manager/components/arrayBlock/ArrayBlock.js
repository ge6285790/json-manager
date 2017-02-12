import React, { Component } from 'react';
import css from './arrayBlock.scss';

const ArrayBlock = (props) => {
  let keyTitle = props.keyTitle;
  keyTitle = keyTitle === '' ? '[' : `"${keyTitle}": [`;
  const { blockType, refernceFlag, methods, modeType, editedRecord } = props;
  const { renderChild, jsonDataTempAdd, jsonDataEditTempAdd } = methods;
  const edited = props.keyTitle === '__edited_record' ? '__edited_record' : false;
  if (modeType === 'send') {
    return (
      <div className={`array-block ${editedRecord || edited}`}>
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
    <div data-mode="edit" className={`array-block ${editedRecord || edited}`}>
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

// class ArrayBlock extends React.Component {
//   // console.log('ArrayBlock nextProps', nextProps, this.props)
//   shouldComponentUpdate(nextProps, nextState) {
//     // if (nextProps.data === this.props.data) {
//     //   console.log('-----ArrayBlock not update----');
//     //   return false;
//     // }
//     // return true;
//     return shallowCompare(this, nextProps, nextState);
//   }
//   render() {
//     console.log('-----array----');
//     let keyTitle = this.props.keyTitle;
//     // keyTitle = `"${keyTitle}": [`;
//     keyTitle = keyTitle === '' ? '[' : `"${keyTitle}": [`;
//     const { blockType, refernceFlag, methods, modeType, editedRecord } = this.props;
//     const { renderChild, jsonDataTempAdd, jsonDataEditTempAdd } = methods;
//     const edited = this.props.keyTitle === '__edited_record' ? '__edited_record' : false;
//     if (modeType === 'send') {
//       return (
//         <div className={`array-block ${editedRecord || edited}`}>
//           <span
//             onClick={() => {
//               jsonDataTempAdd(refernceFlag);
//             }}
//           >
//             {keyTitle}
//           </span>
//
//           {renderChild(this.props.data, blockType, refernceFlag, modeType)}
//           <span className="array-tail">{']'}</span>
//         </div>
//       );
//     }
//     return (
//       <div data-mode="edit" className={`array-block ${editedRecord || edited}`}>
//         <span
//           onClick={() => {
//             jsonDataEditTempAdd(refernceFlag);
//             // console.log('edit');
//           }}
//         >
//           {keyTitle}
//         </span>
//         {renderChild(this.props.data, blockType, refernceFlag, modeType)}
//         <span className="array-tail">{']'}</span>
//       </div>
//     );
//   }
// }
//
// ArrayBlock.propTypes = {
//   data: React.PropTypes.array.isRequired,
//   keyTitle: React.PropTypes.string.isRequired,
//   blockType: React.PropTypes.string.isRequired,
//   refernceFlag: React.PropTypes.string.isRequired,
//   methods: React.PropTypes.object.isRequired,
//   modeType: React.PropTypes.string.isRequired,
//   editedRecord: React.PropTypes.string.isRequired,
// };
//
// export default ArrayBlock;
//

ArrayBlock.propTypes = {
  data: React.PropTypes.array.isRequired,
  keyTitle: React.PropTypes.string.isRequired,
  blockType: React.PropTypes.string.isRequired,
  refernceFlag: React.PropTypes.string.isRequired,
  methods: React.PropTypes.object.isRequired,
  modeType: React.PropTypes.string.isRequired,
  editedRecord: React.PropTypes.string.isRequired,
};

export default ArrayBlock;
