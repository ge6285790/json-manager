/* eslint-env browser */

import React from 'react';
import css from './settingMenuEdit.scss';

class SettingMenuEdit extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.modeOptionType === 'send' && nextProps.modeOptionType === 'send') {
      return false;
    }
    return true;
  }
  render() {
    const { methods, editScopeFlags, modeOptionType, status, render } = this.props;
    console.log('SettingMenuEdit', this.props);
    return (
      <div className="setting-menu-edit" data-active={modeOptionType === 'edit' ? 'true' : 'false'} >
        <ul>
          <li>
            <div className="refernce-flag-input">
              <span className="flags" key={'Choice the key...editScope'}>{editScopeFlags || 'Choice the key...'}</span>
            </div>
          </li>
          <li>
            <div className="textarea">
              {render.renderDataEditTextarea()}
            </div>
          </li>
          <li>
            <span className="change_value_type">Change Value Type: </span>
            <br />
            <span className="type-radio">
              <input type="radio" name="value-type" onChange={() => { methods.editTypeUpdate('String'); }} defaultChecked />
              String
            </span>
            <span className="type-radio">
              <input type="radio" name="value-type" onChange={() => { methods.editTypeUpdate('Array'); }} />
              Array
            </span>
            <span className="type-radio">
              <input type="radio" name="value-type" onChange={() => { methods.editTypeUpdate('Object'); }} />
              Object
            </span>
          </li>
          <li className="clearfix">
            <span className="change_value_type">Add Sub Value: </span>
            <br />
            <span className="type-radio">
              <input type="radio" name="sub-type" onChange={() => { status.addSubValueType = 'String'; }} defaultChecked="true" />
              String
            </span>
            <span className="type-radio">
              <input type="radio" name="sub-type" onChange={() => { status.addSubValueType = 'Array'; }} />
              Array
            </span>
            <span className="type-radio">
              <input type="radio" name="sub-type" onChange={() => { status.addSubValueType = 'Object'; }} />
              Object
            </span>
            <br />
            <span className="type-radio">
              {/* <input type="radio" name="sub-type" onChange={() => { status.addSubValueType = 'Clone'; }} /> */}
              Clone Other
              <input
                className="clone_reference"
                type="text"
                name="type"
                placeholder={`ex. ${editScopeFlags || '>month1'}>subkey`}
                onClick={() => { status.addSubValueType = 'Clone'; }}
                onChange={(e) => { status.cloneSubValueType = e.target.value; }}
              />
            </span>
            <br />
            <span className="type-radio float-right">
              <span
                className="add-button"
                onClick={() => { methods.addSubValue(); }}
              >
                Add
              </span>
            </span>
          </li>
        </ul>
        <div className="text-center">
          <span
            className="json-button"
            onClick={() => { methods.downloadJSONFile(); }}
          >
            Download JSON file
          </span>
        </div>
      </div>
    );
  }
}

// const SettingMenuEdit = (props) => {
//   const { methods, editScopeFlags, modeOptionType, status, render } = props;
//   console.log('SettingMenuEdit', props);
//   return (
//     <div className="setting-menu-edit" data-active={modeOptionType === 'edit' ? 'true' : 'false'} >
//       <ul>
//         <li>
//           <div className="refernce-flag-input">
//             <span className="flags" key={'Choice the key...editScope'}>{editScopeFlags || 'Choice the key...'}</span>
//           </div>
//         </li>
//         <li>
//           <div className="textarea">
//             {render.renderDataEditTextarea()}
//           </div>
//         </li>
//         <li>
//           <span className="change_value_type">Change Value Type: </span>
//           <br />
//           <span className="type-radio">
//             <input type="radio" name="value-type" onChange={() => { methods.editTypeUpdate('String'); }} defaultChecked />
//             String
//           </span>
//           <span className="type-radio">
//             <input type="radio" name="value-type" onChange={() => { methods.editTypeUpdate('Array'); }} />
//             Array
//           </span>
//           <span className="type-radio">
//             <input type="radio" name="value-type" onChange={() => { methods.editTypeUpdate('Object'); }} />
//             Object
//           </span>
//         </li>
//         <li className="clearfix">
//           <span className="change_value_type">Add Sub Value: </span>
//           <br />
//           <span className="type-radio">
//             <input type="radio" name="sub-type" onChange={() => { status.addSubValueType = 'String'; }} defaultChecked="true" />
//             String
//           </span>
//           <span className="type-radio">
//             <input type="radio" name="sub-type" onChange={() => { status.addSubValueType = 'Array'; }} />
//             Array
//           </span>
//           <span className="type-radio">
//             <input type="radio" name="sub-type" onChange={() => { status.addSubValueType = 'Object'; }} />
//             Object
//           </span>
//           <br />
//           <span className="type-radio">
//             {/* <input type="radio" name="sub-type" onChange={() => { status.addSubValueType = 'Clone'; }} /> */}
//             Clone Other
//             <input
//               className="clone_reference"
//               type="text"
//               name="type"
//               placeholder={`ex. ${editScopeFlags || '>month1'}>subkey`}
//               onClick={() => { status.addSubValueType = 'Clone'; }}
//               onChange={(e) => { status.cloneSubValueType = e.target.value; }}
//             />
//           </span>
//           <br />
//           <span className="type-radio float-right">
//             <span
//               className="add-button"
//               onClick={() => { methods.addSubValue(); }}
//             >
//               Add
//             </span>
//           </span>
//         </li>
//       </ul>
//       <div className="text-center">
//         <span
//           className="json-button"
//           onClick={() => { methods.downloadJSONFile(); }}
//         >
//           Download JSON file
//         </span>
//       </div>
//     </div>
//   );
// };

SettingMenuEdit.propTypes = {
  methods: React.PropTypes.object.isRequired,
  editScopeFlags: React.PropTypes.string.isRequired,
  modeOptionType: React.PropTypes.string.isRequired,
  status: React.PropTypes.object.isRequired,
  render: React.PropTypes.object.isRequired,
};

export default SettingMenuEdit;
