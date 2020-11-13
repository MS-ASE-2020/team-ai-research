import React, { Component } from "react";
import Folder from "./Folder"

export default class BookmarksZone extends Component {
    constructor(props) {
      super(props)
      this.state = {
        filePath: [],
        folderID: 1
      }
    }
  
    backward() {
      let folder = window.api.database.getFolderProperty(window.db, this.state.folderID)
      let newFolderID = folder.fatherID
      if (newFolderID === null) {
        alert("This is the ROOT!")
      } else {
        let newFilePath = this.state.filePath.slice()
        newFilePath.pop()
        this.setState({
          filePath: newFilePath,
          folderID: newFolderID
        })
      }
    }

    forward(newPath, newFolderID) {
      let newFilePath = this.state.filePath.slice()
      newFilePath.push(newPath)
      this.setState({
        filePath: newFilePath,
        folderID: newFolderID
      }) 
    }
  
    render() {
      return (
        <div className="BookmarksZone">
          <input type="button" value="↑" onClick={this.backward.bind(this)}/>
          <input id="filePath" type="text" value={"/" + this.state.filePath.join("")} disabled/>
          <Folder folderID={this.state.folderID} forward={this.forward.bind(this)}/>
        </div>
      );
    }
}