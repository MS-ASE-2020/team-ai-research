import React, { Component } from "react";
import PropTypes from "prop-types";

class OpenFileZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileSource: undefined,
      filePath: undefined,
    };
  }

  handleSelectLocal() {
    this.setState({
      fileSource: "local",
    });
    this.fileInput.click();
  }

  handleSelectUrl() {
    this.setState({
      fileSource: "url",
    });
  }

  handleFileSourceChange(event) {
    this.setState({
      fileSource: event.target.value,
    });
  }

  handleLocalPathChange(event) {
    if (event.target.files[0]) {
      let filePath = "file://" + event.target.files[0].path;
      this.props.openFileCallback(filePath);
    }
  }

  handleUrlPathChange(event) {
    this.setState({
      filePath: event.target.value,
    });
  }

  handleOpenFile() {
    this.props.openFileCallback(this.state.filePath);
  }

  render() {
    return (
      <div className="open-new-file">
        <h2 className="heading">Open a new file</h2>
        <div className="openfile-options">
          <div className="option" onClick={this.handleSelectLocal.bind(this)}>
            <div className="option-icon">
              <i className="fas fa-5x fa-file-pdf" />
            </div>
            <div className="option-title">Local File</div>
          </div>
          <div
            className={
              "option" + (this.state.fileSource === "url" ? " active" : "")
            }
            onClick={this.handleSelectUrl.bind(this)}
          >
            <div className="option-icon">
              <i className="far fa-5x fa-globe" />
            </div>
            <div className="option-title">From URL</div>
          </div>
        </div>
        <div className="section d-none">
          <div className="section-content">
            <input
              type="file"
              ref={(self) => (this.fileInput = self)}
              onChange={(e) => this.handleLocalPathChange(e)}
            />
          </div>
        </div>
        <div
          className={
            "section" + (this.state.fileSource === "url" ? "" : " d-none")
          }
        >
          <div className="section-content url-bar">
            <input
              type="text"
              ref={(self) => (this.urlInput = self)}
              placeholder="Enter URL here"
              onChange={(e) => this.handleUrlPathChange(e)}
            />
            <button className="btn" onClick={this.handleOpenFile.bind(this)}>
              Open
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default class OpenFile extends Component {
  openFile(f) {
    this.props.onOpenFile(f);
  }

  render() {
    let listItems = [];
    let allPaperList = window.api.database.listPaper(window.db, null);
    console.log(allPaperList);
    for (let i = 0; i < allPaperList.length; i++) {
      listItems.push(
        <div
          className="file-item"
          key={"item-" + i}
          onClick={() => {
            console.log(allPaperList[i].ID);
            this.openFile("paper://" + allPaperList[i].ID);
          }}
        >
          {allPaperList[i].name}
        </div>
      );
    }
    return (
      <div id="OpenFile" className="OpenFile">
        <div className="file-menu">
          <div className="menu-item menu-title clickable">
            <h2>Open File</h2>
          </div>
          <div className="menu-item file-list__wrap">
            <div className="file-list__inner-wrap">
              <div className="file-list">{listItems}</div>
            </div>
          </div>
          <div className="menu-item menu-title clickable">
            <h2>Settings</h2>
          </div>
        </div>

        <div className="file-details">
          <OpenFileZone openFileCallback={this.openFile.bind(this)} />
        </div>
      </div>
    );
  }
}

OpenFileZone.propTypes = {
  openFile: PropTypes.func.isRequired,
};

OpenFile.propTypes = {
  onOpenFile: PropTypes.func.isRequired,
};
