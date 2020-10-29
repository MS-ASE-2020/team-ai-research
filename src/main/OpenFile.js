import React, { Component } from "react";

export default class OpenFile extends Component {
  render() {
    var placeholderItems = [];
    for (let i = 0; i < 30; i++) {
      placeholderItems.push(<div className="file-item">Item {i + 1}</div>);
    }
    return (
      <div id="OpenFile" className="OpenFile">
        <div className="file-menu">
          <div className="menu-item menu-title">
            <h2>Open File</h2>
          </div>
          <div className="menu-item file-list__wrap">
            <div className="file-list__inner-wrap">
              <div className="file-list">{placeholderItems}</div>
            </div>
          </div>
          <div className="menu-item menu-title">
            <h2>Settings</h2>
          </div>
        </div>
        <div className="file-properties">Placeholder</div>
      </div>
    );
  }
}
