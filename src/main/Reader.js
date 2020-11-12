import React, { Component } from "react";
import PDFReader from "./reader/PDFReader";

export default class Reader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFile: undefined,
    };
  }

  getPaperID(url) {
    const protocol = "paper://";
    if (url && url.startsWith(protocol)) {
      return parseInt(url.slice(protocol.length));
    }
  }

  render() {
    const file = this.props.data.openFile;
    return (
      <div id="Reader" className="Reader">
        <PDFReader key={file} file={file} paperID={this.getPaperID(file)}></PDFReader>
      </div>
    );
  }
}
