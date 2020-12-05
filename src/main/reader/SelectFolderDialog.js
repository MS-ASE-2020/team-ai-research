import React, { Component } from "react";
import PropTypes from 'prop-types';

import Bookmarks from "../Bookmarks";

export default class SelectFolderDialog extends Component {
  render() {
    return (
      <div
        className={
          "select-folder-wrapper" + (this.props.extraClasses ? " " + this.props.extraClasses : "")
        }
      >
        <div className="select-folder-dialog">
          <Bookmarks
            folderOnly={true}
            selectFolderCallback={this.props.selectFolderCallback}
          />
        </div>
      </div>
    );
  }
}

SelectFolderDialog.propTypes = {
  selectFolderCallback: PropTypes.func,
  extraClasses: PropTypes.string
};