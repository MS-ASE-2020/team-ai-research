import React, { Component } from "react";
import Annotator from 'pdf-module';

export default class PDFReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: this.props.file,
    };
  }

  render() {
    return (
      <Annotator file={this.state.file} docid={this.state.file + "_id"}></Annotator>
    );
  }
}
