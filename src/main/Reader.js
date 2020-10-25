import React, { Component } from "react";

export default class Reader extends Component {
  render() {
    return (
      <div id="Reader" className="Reader">
        <h1>Hello World!</h1>
        We are using node {this.props.versions.node},<br />
        Chrome {this.props.versions.chrome},<br />
        and Electron {this.props.versions.electron}.
      </div>
    );
  }
}
