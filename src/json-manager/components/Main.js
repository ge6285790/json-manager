import React, { Component } from 'react';
import ObjectBlock from './objectBlock/ObjectBlock';
import update from 'react-addons-update';

class Main extends Component {
  constructor(props) {
    super(props)
    console.log(props);
    const { option, crud } = props.data;
    this.state = {
      data: option.defaultData || {},
      crud,
    }
  }

  addNewKey(flags, value) {
    // let flag = { data };
    // for (let key in flags) {
    //   flag =
    // }
    // this.setState(update(this.state, {
    //   data
    // }))
  }

  render() {
    return (
      <div className="json-manager">
        <ObjectBlock />
      </div>
    );
  }
}

export default Main;
