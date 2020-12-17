import React, { Component } from "react";
import Folder from "./Folder";
import InfoZone from "./InfoZone";
import PropTypes from 'prop-types';


export default class Bookmarks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: [],
      folderID: 1,
      newBookmark: false,
      chooseFolder: 0,
      choosePaper: 0,
      search: false,
    };
  }

  /**
   * As currently `Bookmarks` has no `props`, this function is commented.
   */
  /*
  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    this.setState({
      filePath: [],
      folderID: 1,
      newBookmark: false,
      chooseFolder: 0,
      choosePaper: 0,
      search: false,
    });
  }
  */

  clearInfoZone() {
    this.setState({
      newBookmark: false,
      chooseFolder: 0,
      choosePaper: 0,
      search: false,
    });
  }

  setNewBookmark() {
    this.clearInfoZone();
    this.setState({
      newBookmark: true,
    });
  }

  setChooseFolder(folderID) {
    this.clearInfoZone();
    this.setState({
      chooseFolder: folderID,
    });
  }

  setChoosePaper(paperID) {
    this.clearInfoZone();
    this.setState({
      choosePaper: paperID,
    });
  }

  setSearch() {
    this.clearInfoZone();
    this.setState({
      search: true,
    });
  }

  backward() {
    if (this.state.folderID === null) {
      this.setState({
        filePath: [],
        folderID: 1,
      });
      this.clearInfoZone();
    } else if (this.state.folderID === 1) {
      alert("This is the ROOT!");
    } else {
      let folder = window.api.database.getFolderProperty(
        window.db,
        this.state.folderID
      );
      let newFilePath = this.state.filePath.slice();
      newFilePath.pop();
      this.setState({
        filePath: newFilePath,
        folderID: folder.fatherID,
      });
    }
    this.clearInfoZone();
  }

  forward(newPath, newFolderID) {
    let newFilePath = this.state.filePath.slice();
    newFilePath.push(newPath + "/");
    this.setState({
      filePath: newFilePath,
      folderID: newFolderID,
    });
    this.clearInfoZone();
  }

  updateLatest(name) {
    if (this.state.filePath.length === 0) {
      console.error("Root folder name shall not be changed!");
      return;
    }
    let newFilePath = this.state.filePath.slice();
    newFilePath[newFilePath.length - 1] = name + "/";
    this.setState({
      filePath: newFilePath,
    });
  }

  render() {
    return (
      <div id={this.props.id || "Bookmarks"} className="Bookmarks">
        <div className="left-pane">
          <div className="address-bar">
            <div
              className="btn"
              onClick={this.backward.bind(this)}
              disabled={this.state.filePath.length === 0}
            >
              <i className="fas fa-arrow-alt-up" />
            </div>
            <div className="address-wrapper">
              <input
                id="filePath"
                type="text"
                value={"/" + this.state.filePath.join("")}
                disabled
              />
            </div>
            <div className="btn" onClick={this.setSearch.bind(this)}>
              <i className="fas fa-search" />
            </div>
          </div>
          <Folder
            folderOnly={this.props.folderOnly}
            selectFolderCallback={this.props.selectFolderCallback}
            folderID={this.state.folderID}
            chooseFolder={this.state.chooseFolder}
            choosePaper={this.state.choosePaper}
            setNewBookmark={this.setNewBookmark.bind(this)}
            forward={this.forward.bind(this)}
            setChooseFolder={this.setChooseFolder.bind(this)}
            setChoosePaper={this.setChoosePaper.bind(this)}
          />
        </div>
        <div className="right-pane">
          <InfoZone
            folderID={this.state.folderID}
            clearInfoZone={this.clearInfoZone.bind(this)}
            forward={this.forward.bind(this)}
            updateLatest={this.updateLatest.bind(this)}
            newBookmark={this.state.newBookmark}
            chooseFolder={this.state.chooseFolder}
            choosePaper={this.state.choosePaper}
            search={this.state.search}
            setChooseFolder={this.setChooseFolder.bind(this)}
            setChoosePaper={this.setChoosePaper.bind(this)}
            actions={this.props.actions}
            openFolderCallback={this.props.selectFolderCallback}
          />
        </div>
      </div>
    );
  }
}

Bookmarks.propTypes = {
  actions: PropTypes.object,
  selectFolderCallback: PropTypes.func,
  folderOnly: PropTypes.bool
};
