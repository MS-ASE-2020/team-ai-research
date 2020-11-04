import React, { Component } from "react";
import PDFReader from "./reader/PDFReader";

export default class Reader extends Component {
  render() {
    return (
      <div id="Reader" className="Reader">
        <PDFReader documentId={this.props.data.openFile}></PDFReader>
      </div>
    );
  }
}
