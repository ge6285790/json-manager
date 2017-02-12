import React, { Component } from 'react';
import css from './stringBlock.scss';

const StringBlock = (props) => {
  // console.log('-----StringBlock-----');
  const { classNameString, value, methods, refernceFlag, keyTitle, modeType } = props;
  const { jsonDataTempAdd, jsonDataEditTempAdd } = methods;
  if (modeType === 'send') {
    return (
      <span className="string-block">
        <span onClick={() => { jsonDataTempAdd(refernceFlag); }}>{keyTitle}</span>
        <span
          id="sim-input"
          className={classNameString}
          contentEditable="true"
          // onInput={(e) => { console.log(e.target.innerText); }}
          onFocus={(e) => {
            console.log('edit');
          }}
          onBlur={(e) => {
            methods.jsonDataUPDATE(e.target.innerText, refernceFlag);
          }}
        >
          {value}
        </span>
      </span>
    );
  }
  return (
    <span className="string-block">
      <span
        data-mode="edit"
        onClick={() => { jsonDataEditTempAdd(refernceFlag); }}
      >
        {keyTitle}
      </span>
      <span
        id="sim-input"
        className={classNameString}
        contentEditable="true"
        // onInput={(e) => { console.log(e.target.innerText); }}
        onFocus={(e) => {
          console.log('in');
        }}
        onBlur={(e) => {
          methods.jsonDataUPDATE(e.target.innerText, refernceFlag);
        }}
      >
        {value}
      </span>
    </span>
  );
};

// class StringBlock extends React.Component {
//   shouldComponentUpdate(nextProps, nextState) {
//     console.log('--------------', nextProps);
//     if (nextProps === this.props) {
//       console.log('-----StringBlock not update----');
//       return false;
//     }
//     return true;
//   }
//   render() {
//     console.log('-----StringBlock-----');
//     const { classNameString, value, methods, refernceFlag, keyTitle, modeType } = this.props;
//     const { jsonDataTempAdd, jsonDataEditTempAdd } = methods;
//     if (modeType === 'send') {
//       return (
//         <span className="string-block">
//           <span onClick={() => { jsonDataTempAdd(refernceFlag); }}>{keyTitle}</span>
//           <span
//             id="sim-input"
//             className={classNameString}
//             contentEditable="true"
//             // onInput={(e) => { console.log(e.target.innerText); }}
//             onFocus={(e) => {
//               console.log('in');
//             }}
//             onBlur={(e) => {
//               methods.jsonDataUPDATE(e.target.innerText, refernceFlag);
//             }}
//           >
//             {value}
//           </span>
//         </span>
//       );
//     }
//     return (
//       <span className="string-block">
//         <span
//           data-mode="edit"
//           onClick={() => { jsonDataEditTempAdd(refernceFlag); }}
//         >
//           {keyTitle}
//         </span>
//         <span
//           id="sim-input"
//           className={classNameString}
//           contentEditable="true"
//           // onInput={(e) => { console.log(e.target.innerText); }}
//           onFocus={(e) => {
//             console.log('in');
//           }}
//           onBlur={(e) => {
//             methods.jsonDataUPDATE(e.target.innerText, refernceFlag);
//           }}
//         >
//           {value}
//         </span>
//       </span>
//     );
//   }
// }

StringBlock.propTypes = {
  classNameString: React.PropTypes.string.isRequired,
  methods: React.PropTypes.object.isRequired,
  refernceFlag: React.PropTypes.string.isRequired,
  keyTitle: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  modeType: React.PropTypes.string.isRequired,
};

export default StringBlock;
