import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SaveDialog extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   file: this.props.file,
    //   paperID: this.props.paperID,
    // };
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
          <button onClick={() => this.props.save(
            this.props.info.ID, 'test' + Math.random().toString(3), 'test', 'test', 2038, 'fjwtql', '', this.props.info.annotations)}>Save</button>
          <button onClick={() => this.props.close()}>Cancel</button>
        </div>
      </div>
    );
  }
}


SaveDialog.propTypes = {
  // file: PropTypes.object,
  // paperID: PropTypes.number,
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  info: PropTypes.object
};
