import React from 'react';
import css from './settingMenuSend.scss';

const SettingMenuSend = (props) => {
  const { render, methods, crud, modeOptionType, updateScopeSendApiType } = props;
  return (
    <div className="setting-menu-send" data-active={modeOptionType === 'send' ? 'true' : 'false'} >
      <ul>
        <li>
          <div className="refernce-flag-input">
            {render.renderRefernceFlagInputValue()}
          </div>
        </li>
        <li>
          <div className="textarea">
            {render.renderDataTextarea()}
          </div>
        </li>
        <li>
          <span className="type-radio">
            <input type="radio" name="type" onChange={() => { methods.sendTypeUpdate('Default'); }} defaultChecked />
            Default
          </span>
          <span className="type-radio">
            <input type="radio" name="type" onChange={() => { methods.sendTypeUpdate('Array'); }} />
            Array
          </span>
          <span className="type-radio">
            <input type="radio" name="type" onChange={() => { methods.sendTypeUpdate('Object'); }} />
            Object
          </span>
        </li>
        <li>
          <ul className="send-type">
            <li
              data-active={updateScopeSendApiType === 'update' ? 'true' : ''}
              onClick={() => {
                methods.sendApiTabSwitch('update');
              }}
            >
              Update
            </li>
            <li
              data-active={updateScopeSendApiType === 'create' ? 'true' : ''}
              onClick={() => {
                methods.sendApiTabSwitch('create');
              }}
            >
              Create
            </li>
            <li
              data-active={updateScopeSendApiType === 'delete' ? 'true' : ''}
              onClick={() => {
                methods.sendApiTabSwitch('delete');
              }}
            >
              Delete
            </li>
          </ul>
          <div className="send-setting">
            <div data-active={updateScopeSendApiType === 'update' ? 'true' : ''} className="update">
              <div className="api-url-option">
                <select value={crud.update.type} onChange={(e) => { methods.crudTypeUpdate('update', e.target.value); }}>
                  <option value={'POST'}>POST</option>
                  <option value={'GET'}>GET</option>
                </select>
                <input placeholder="Update API URL" value={crud.update.url} onChange={(e) => { methods.crudUrlUpdate('update', e.target.value); }} />
              </div>
              <div className="api-send">
                <div onClick={() => { methods.callUpdateApi('update'); }}>Send</div>
              </div>
            </div>
            <div data-active={updateScopeSendApiType === 'create' ? 'true' : ''} className="create">
              <div className="api-url-option">
                <select value={crud.create.type} onChange={(e) => { methods.crudTypeUpdate('create', e.target.value); }}>
                  <option value={'POST'}>POST</option>
                  <option value={'GET'}>GET</option>
                </select>
                <input placeholder="Create API URL" value={crud.create.url} onChange={(e) => { methods.crudUrlUpdate('create', e.target.value); }} />
              </div>
              <div className="api-send">
                <div onClick={() => { methods.callUpdateApi('create'); }}>Send</div>
              </div>
            </div>
            <div data-active={updateScopeSendApiType === 'delete' ? 'true' : ''} className="delete">
              <div className="api-url-option">
                <select value={crud.delete.type} onChange={(e) => { methods.crudTypeUpdate('delete', e.target.value); }}>
                  <option value={'DELETE'}>DELETE</option>
                  <option value={'POST'}>POST</option>
                  <option value={'GET'}>GET</option>
                </select>
                <input placeholder="Delete API URL" value={crud.delete.url} onChange={(e) => { methods.crudUrlUpdate('delete', e.target.value); }} />
              </div>
              <div className="api-send">
                <div onClick={() => { methods.callUpdateApi('delete'); }}>Send</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

SettingMenuSend.propTypes = {
  methods: React.PropTypes.object.isRequired,
  updateScopeSendApiType: React.PropTypes.string.isRequired,
  modeOptionType: React.PropTypes.string.isRequired,
  render: React.PropTypes.object.isRequired,
  crud: React.PropTypes.object.isRequired,
};

export default SettingMenuSend;
