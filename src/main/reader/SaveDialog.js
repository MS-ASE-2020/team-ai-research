import React, { Component } from "react";

export default class SaveDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: this.props.file,
      paperID: this.props.paperID,
    };
  }

  render() {
    return (
      <div className="save-wrapper">
        <div className="save-dialog">
          <h2 className="save-lead">Name</h2>
          <h2 className="save-lead">Title</h2>
          <h2 className="save-lead">Keywords</h2>
          <h2 className="save-lead">Year</h2>
          <h2 className="save-lead">Conference</h2>
          <h2 className="save-lead">Library</h2>
          <button>Test</button>
        </div>
      </div>
    );
  }
}
