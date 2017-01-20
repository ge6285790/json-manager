import React from 'react';
import { render } from 'react-dom';
import Main from './components/Main';
import css from './css/json-manager.scss';

function Jmgr(option, crud, elementId) {
  this.data = {
    option,
    crud,
    elementId,
  };

  this.fetchData = () => {
    let fetchUrl = this.crud.read;
    if (!fetchUrl) {
      fetchUrl = prompt('Read url didn\'t set, please enter read url');
    }
    fetch(fetchUrl).then(response => response.json())
      .then(data => console.log(data))
      .catch(e => console.log('Oops, error', e));
  };

  this.render = () => {
    render(<Main data={this.data} />, document.getElementById(elementId));
  };
}

export default Jmgr;
