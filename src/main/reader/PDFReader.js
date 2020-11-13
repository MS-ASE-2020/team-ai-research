import React, { Component } from "react";
import PropTypes from 'prop-types';

import Annotator from 'pdf-module';

export default class PDFReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: this.props.file,
      paperID: this.props.paperID
    };
  }

  render() {
    return (
      <Annotator file={this.state.file} docid={this.state.file + "_id"} paperID={this.state.paperID}></Annotator>
    );
  }
}

PDFReader.propTypes = {
  file: PropTypes.string,
  paperID: PropTypes.number
};