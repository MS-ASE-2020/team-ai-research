import React, { Component } from "react";
import PropTypes from 'prop-types';

import OpenFile from "./OpenFile";

export default class FileManager extends Component {
  render() {
    return (
      <div id="FileManager" className="FileManager">
        <OpenFile onOpenFile={(f) => this.props.actions.openFile(f)}/>
      </div>
    );
  }
}

FileManager.propTypes = {
  actions: PropTypes.object.isRequired
};
