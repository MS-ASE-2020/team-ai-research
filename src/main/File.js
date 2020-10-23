import React, { Component } from "react";

export default class FileManager extends Component {
  render() {
    return (
      <div id="FileManager" className="FileManager">
        <h1>Hello World!</h1>
        We are using node {this.props.versions.node},<br />
        Chrome {this.props.versions.chrome},<br />
        and Electron {this.props.versions.electron}.
      </div>
    );
  }
}
