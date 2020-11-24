import React, { Component } from "react";
import PropTypes from 'prop-types';


class OpenFileZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileSource: undefined,
      filePath: undefined,
    };
  }

  handleFileSourceChange(event) {
    this.setState({
      fileSource: event.target.value,
    });
  }

  handleLocalPathChange(event) {
    if (event.target.files[0]) {
      this.setState({
        filePath: "file://" + event.target.files[0].path,
      });
    }
  }

  handleUrlPathChange(event) {
    this.setState({
      filePath: event.target.value,
    });
  }

  render() {
    return (
      <div className="open-new-file">
        <h2 className="heading">Please choose a method to open a PDF file:</h2>
        <div className="section">
          <h3 className="section-title has-select">
            <input
              type="radio"
              id="file-local"
              value="local"
              name="file-source"
              onChange={this.handleFileSourceChange.bind(this)}
            />
            <label htmlFor="file-local">Local File</label>
          </h3>
          <div className="section-content">
            <input
              type="file"
              onChange={(e) => this.handleLocalPathChange(e)}
              disabled={this.state.fileSource !== "local"}
            />
          </div>
        </div>
        <div className="section">
          <h3 className="section-title has-select">
            <input
              type="radio"
              id="file-url"
              value="url"
              name="file-source"
              onChange={this.handleFileSourceChange.bind(this)}
            />
            <label htmlFor="file-url">From URL</label>
          </h3>
          <div className="section-content">
            <input
              type="text"
              onChange={(e) => this.handleUrlPathChange(e)}
              disabled={this.state.fileSource !== "url"}
            />
          </div>
        </div>
        <button onClick={() => this.props.openFile(this.state.filePath)}>
          Open
        </button>
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
      listItems.push((
        <div className="file-item" key={"item-" + i} onClick={() => {
          console.log(allPaperList[i].ID);
          this.openFile("paper://" + allPaperList[i].ID);
        }}>{allPaperList[i].name}</div>
      ));
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
          <OpenFileZone openFile={this.openFile.bind(this)}/>
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
