import React, { Component } from 'react';
import css from './stringBlock.scss';

// class StringBlock extends Component {
//   constructor(props) {
//     super(props);
//   }
//
//   render() {
//     // const { renderChild } = this.props.methods;
//     const { classNameString, value, methods, refernceFlag, keyTitle } = this.props;
//     const { jsonDataUPDATE, dataPrepare } = methods;
//     return (
//       <span className="string-block">
//         <span onClick={() => { dataPrepare(refernceFlag); }}>{keyTitle}</span>
//         <span
//           id="sim-input"
//           className={classNameString}
//           contentEditable="true"
//           onInput={(e) => { console.log(e.target.innerText); }}
//           onBlur={(e) => {
//             console.log('aaa', e.target);
//             methods.jsonDataUPDATE(e.target.innerText, refernceFlag);
//           }}
//         >
//           {value}
//         </span>
//       </span>
//     );
//   }
// }

const StringBlock = (props) => {
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
  }
  return (
    <span className="string-block">
      <span data-mode="edit" onClick={() => { jsonDataEditTempAdd(refernceFlag); }}>{keyTitle}</span>
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

StringBlock.propTypes = {
  classNameString: React.PropTypes.string.isRequired,
  methods: React.PropTypes.object.isRequired,
  refernceFlag: React.PropTypes.string.isRequired,
  keyTitle: React.PropTypes.string.isRequired,
};

export default StringBlock;
