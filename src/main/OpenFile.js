import React, { Component } from "react";

class OpenFileZone extends Component {
  render() {
    return (
      <div className="file-properties">
        <h3>Please choose a method to open a PDF file:</h3>
        <br/>
        <h4>Local Path</h4>
        <p> 
          <button id="localPathButton" onClick={() => alert(document.getElementById("localPath").value)}>Open</button>
          <input type="file" id="localPath"/>
        </p>
        <br/>
        <h4>URL Path</h4>
        <p> 
          <button id="urlPathButton" onClick={() => alert(document.getElementById("urlPath").value)}>Open</button>
          <input type="text" id="urlPath"/>
        </p>    
      </div>
    )
  }
}

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
        <OpenFileZone />
      </div>
    );
  }
}
