import React, { Component } from "react";
import Folder from "./Folder";
import InfoZone from "./InfoZone";

export default class BookmarksZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: [],
      folderID: 1,
      newBookmark: false,
      chooseFolder: 0,
      choosePaper: 0,
      search: false
    };
  }
  
  cleanInfoZone() {
    this.setState({
      newBookmark: false,
      chooseFolder: 0,
      choosePaper: 0,
      search: false
    })
  }

  setNewBookmark() {
    this.setState({
      newBookmark: true,
      chooseFolder: 0,
      choosePaper: 0,
      search: false
    })
  }

  setChooseFolder(folderID) {
    this.setState({
      newBookmark: false,
      chooseFolder: folderID,
      choosePaper: 0,
      search: false
    })
  }

  setChoosePaper(paperID) {
    this.setState({
      newBookmark: false,
      chooseFolder: 0,
      choosePaper: paperID,
      search: false
    })
  }

  setSearch(){
    this.setState({
      newBookmark: false,
      chooseFolder: 0,
      choosePaper: 0,
      search: true
    })
  }

  backward() {
    if (this.state.folderID === null) {
      this.setState({
        filePath: [],
        folderID: 1
      });
    } else {
      let folder = window.api.database.getFolderProperty(window.db, this.state.folderID);
      let newFilePath = this.state.filePath.slice();
      newFilePath.pop();
      this.setState({
        filePath: newFilePath,
        folderID: folder.fatherID
      });
    }
    this.cleanInfoZone();
  }

  forward(newPath, newFolderID) {
    let newFilePath = this.state.filePath.slice();
    newFilePath.push(newPath + "/");
    this.setState({
      filePath: newFilePath,
      folderID: newFolderID
    }); 
    this.cleanInfoZone();
  }

  updateLatest(name) {
    if (this.state.filePath.length === 0) {
      console.error("Root folder name shall not be changed!");
      return;
    }
    let newFilePath = this.state.filePath.slice();
    newFilePath[newFilePath.length - 1] = name + "/";
    this.setState({
      filePath: newFilePath
    });
  }
  
  render() {
    return (
      <div className="BookmarksZone">
        <input type="button" value="↑" onClick={this.backward.bind(this)} disabled={this.state.filePath.length === 0} />
        <input id="filePath" type="text" value={"/" + this.state.filePath.join("")} disabled/>
        <input type="button" value="Search" onClick={this.setSearch.bind(this)} />
        <Folder folderID={this.state.folderID} chooseFolder={this.state.chooseFolder} choosePaper={this.state.choosePaper}
          setNewBookmark={this.setNewBookmark.bind(this)} forward={this.forward.bind(this)}
          setChooseFolder={this.setChooseFolder.bind(this)} setChoosePaper={this.setChoosePaper.bind(this)} />
        <InfoZone folderID={this.state.folderID} cleanInfoZone={this.cleanInfoZone.bind(this)} forward={this.forward.bind(this)} updateLatest={this.updateLatest.bind(this)}
          newBookmark={this.state.newBookmark} chooseFolder={this.state.chooseFolder} choosePaper={this.state.choosePaper} search={this.state.search}
          setChooseFolder={this.setChooseFolder.bind(this)} setChoosePaper={this.setChoosePaper.bind(this)} />
      </div>
    );
  }
}
