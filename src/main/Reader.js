import React, { Component } from "react";
import PDFReader from "main/reader/PDFReader";

export default class Reader extends Component {
  render() {
    return (
      <div id="Reader" className="Reader">
        <PDFReader></PDFReader>
      </div>
    );
  }
}
