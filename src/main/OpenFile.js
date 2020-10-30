import React, { Component } from "react";

export default class OpenFile extends Component {
  openFile(f) {
    this.props.onOpenFile(f);
  }

  render() {
    var placeholderItems = [];
    for (let i = 0; i < 30; i++) {
      placeholderItems.push(<div className="file-item">Item {i + 1}</div>);
    }
    return (
      <div id="OpenFile" className="OpenFile">
        <div className="file-menu">
          <div className="menu-item menu-title clickable">
            <h2>Open File</h2>
          </div>
          <div className="menu-item file-list__wrap">
            <div className="file-list__inner-wrap">
              <div className="file-list">{placeholderItems}</div>
            </div>
          </div>
          <div className="menu-item menu-title clickable">
            <h2>Settings</h2>
          </div>
        </div>
        <div className="file-properties">
          <h2 className="lead">Open new file</h2>
          <div className="form-row">
            <div className="form-title">Open file</div>
            <div className="form-action">
              <button className="btn">Open</button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-title">Open from URL</div>
            <div className="form-action">
              <button className="btn">Open</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
