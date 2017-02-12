import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Main from './components/Main';
import css from './css/json-manager.scss';
import store from './store/store';


function Jmgr(option) {
  const { defaultData, crud, elementId } = option;
  crud.response = '';
  this.data = {
    defaultData,
    crud,
    elementId,
  };

  this.render = () => {
    render(
      <Provider store={store}>
        {/* <Main data={this.data} /> */}
        <Main jmgr={this} />
      </Provider>,
      document.getElementById(this.data.elementId));
  };
}

export default Jmgr;
