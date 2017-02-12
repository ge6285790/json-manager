import React from 'react';
import Dropzone from 'react-dropzone';
import css from './importJsonModal.scss';

const ImportJsonModal = (props) => {
  const { actions, crud, importModal, methods } = props;

  return (
    <div className="import-json-modal text-center" data-active={importModal.visible}>
      <div className="modal-body text-left">
        <h3>Import JSON</h3>
        <div className="switch-tag clearfix">
          <div className="tag" data-active={importModal.type === 'api' ? 'true' : 'false'} onClick={() => { methods.modeImportModalUpdate('type', 'api'); }}>API</div>
          <div className="tag" data-active={importModal.type === 'file' ? 'true' : 'false'} onClick={() => { methods.modeImportModalUpdate('type', 'file'); }}>FILE</div>
        </div>
        <div className="get-json-by-api" data-active={importModal.type === 'api' ? 'true' : 'false'}>
          <div className="api-type">
            <select defaultValue={crud.read.type} onChange={(e) => { actions.actionsCrud.crudTypeUpdate({ type: 'read', crudType: e.target.value }); }}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
            <input defaultValue={crud.read.url} onBlur={(e) => { actions.actionsCrud.crudUrlUpdate({ type: 'read', url: e.target.value }); }} />
          </div>
          <div className="post-data">
            <p>POST data：</p>
            <textarea onChange={(e) => { actions.actionsCrud.crudDataUpdate({ type: 'read', value: e.target.value }); }} defaultValue="{}" />
          </div>
          <p className="showError" data-active={crud.response === '' ? 'false' : 'true'}>*{crud.response}</p>
          <div className="api-send">
            <div onClick={() => { methods.callReadApi(); }}>Send</div>
          </div>
        </div>
        <div className="get-json-by-drop" data-active={importModal.type === 'file' ? 'true' : 'false'}>
          <div className="file-data">
            <div className="paddingBottom" />
            <Dropzone className="dropzone" onDrop={methods.onDrop} style={{ width: '100%', height: '100%', position: 'absolute', top: '0px', left: '0px' }}>
              <div className="text-center">dropping JSON File here.</div>
            </Dropzone>
          </div>
        </div>
        <div className="close" onClick={() => { methods.modeImportModalUpdate('visible', 'false'); }}>×</div>
      </div>
    </div>
  );
};

ImportJsonModal.propTypes = {
  actions: React.PropTypes.object.isRequired,
  crud: React.PropTypes.object.isRequired,
  importModal: React.PropTypes.object.isRequired,
  methods: React.PropTypes.object.isRequired,
};

export default ImportJsonModal;
